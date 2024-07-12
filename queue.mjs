import Queue from 'bull';
import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config(); // 加载 .env 文件中的环境变量

const prisma = new PrismaClient();
const BENCH_PATH = process.env.BENCH_PATH; // 从环境变量中读取 bench 路径
const MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD; // 从环境变量中读取 MySQL root 密码
const FRAPPE_SITE_URL = process.env.FRAPPE_SITE_URL || 'http://localhost:8000'; // Frappe 站点 URL
const FRAPPE_USERNAME = process.env.FRAPPE_USERNAME || 'Administrator';

// 创建 Bull 队列
const createSiteQueue = new Queue('create-site', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null, // 禁用重试次数限制
  },
  defaultJobOptions: {
    attempts: 5, // 设置任务失败后的重试次数
    backoff: {
      type: 'fixed',
      delay: 5000, // 设置重试的延迟时间（毫秒）
    },
  },
});

// 添加事件监听器
createSiteQueue.on('active', (job) => {
  console.log(`Job ${job.id} is now active`);
});

createSiteQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result: ${result}`);
});

createSiteQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed with error: ${err}`);
});

createSiteQueue.on('progress', (job, progress) => {
  console.log(`Job ${job.id} progress: ${progress}%`);
});

// 执行系统命令的函数，支持传递 MySQL 密码
function executeCommand(command, args, input) {
  return new Promise((resolve, reject) => {
    console.log(`Executing command: ${command} ${args.join(' ')}`);
    const childProcess = spawn(command, args, {
      cwd: BENCH_PATH,
      env: {
        ...process.env,
        PATH: process.env.PATH // 确保使用了 .env 文件中的 PATH
      },
    });

    if (input) {
      childProcess.stdin.write(input);
      childProcess.stdin.end();
    }

    childProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    childProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    childProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`${command} process exited with code ${code}`));
      }
      resolve();
    });
  });
}

// 登录函数，返回登录后的 cookie
async function loginToFrappe(password) {
  try {
    const response = await axios.post(`${FRAPPE_SITE_URL}/api/method/login`, {
      usr: FRAPPE_USERNAME,
      pwd: password,
    });
    const cookies = response.headers['set-cookie'];
    return cookies;
  } catch (error) {
    console.error(`Error logging in to Frappe: ${error}`);
    throw new Error('Failed to log in to Frappe');
  }
}

// 通过 RPC 获取 API key 和 secret 的函数
async function getApiToken(siteName, userName, cookies) {
  try {
    console.log(`Fetching API token for user ${userName} on site ${siteName}`);
    
    // 记录请求细节
    console.log(`Request URL: ${FRAPPE_SITE_URL}/api/resource/User/${userName}`);
    console.log('Request Headers:', {
      'Cookie': cookies.join('; '),
      'X-Frappe-Site-Name': siteName
    });

    const response = await axios.get(`${FRAPPE_SITE_URL}/api/resource/User/${userName}`, {
      headers: {
        'Cookie': cookies.join('; '),
        'X-Frappe-Site-Name': siteName
      }
    });

    const userData = response.data.data;
    console.log('User Data:', userData);

    if (userData.api_key && userData.api_secret) {
      return { apiKey: userData.api_key, apiSecret: userData.api_secret };
    }

    console.log('Generating new API keys...');
    const generateKeysResponse = await axios.post(`${FRAPPE_SITE_URL}/api/method/frappe.core.doctype.user.user.generate_keys`, {
      user: userName,
    }, {
      headers: {
        'Cookie': cookies.join('; '),
        'X-Frappe-Site-Name': siteName
      },
    });

    const { api_key: apiKey, api_secret: apiSecret } = generateKeysResponse.data.message;
    return { apiKey, apiSecret };
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data,
      });
    } else {
      console.error('Error:', error.message);
    }
    throw new Error('Failed to fetch API token');
  }
}

// 定义队列处理器
createSiteQueue.process(async (job) => {
  const { siteName, userName, userId, password } = job.data;

  try {
    console.log(`Processing job: ${job.id}`);

    // 更新进度
    await job.progress(10); // 10% 完成

    // 开始事务
    await prisma.$transaction(async (prisma) => {
      // 创建站点
      try {
        await executeCommand('bench', ['new-site', siteName, '--db-root-password', MYSQL_ROOT_PASSWORD, '--admin-password', password], `${MYSQL_ROOT_PASSWORD}\n`);
      } catch (error) {
        if (error.message.includes('Site already exists')) {
          console.log(`Site ${siteName} already exists, skipping site creation.`);
        } else {
          throw error;
        }
      }
      await job.progress(30); // 30% 完成

      // 安装 erpnext 和 aierp 应用
      await executeCommand('bench', ['--site', siteName, 'install-app', 'erpnext']);
      await job.progress(50); // 50% 完成
      await executeCommand('bench', ['--site', siteName, 'install-app', 'aierp']);
      await job.progress(70); // 70% 完成

      // 登录并获取 cookies
      const cookies = await loginToFrappe(password);

      // 通过 RPC 获取 API key 和 secret
      const { apiKey, apiSecret } = await getApiToken(siteName, 'Administrator', cookies);
      await job.progress(80); // 80% 完成

      // 保存 Token 到数据库
      console.log(`Saving site and token to database for user ${userId}`);
      const site = await prisma.site.create({
        data: {
          name: siteName,
          userId: userId,
        },
      });

      await prisma.token.create({
        data: {
          apiKey,
          apiSecret,
          siteId: site.id,
        },
      });

      // 更新用户表中的 siteName, apiKey 和 apiSecret 字段
      await prisma.user.update({
        where: { id: userId },
        data: {
          siteName,
          apiKey,
          apiSecret,
        },
      });

      await job.progress(100); // 100% 完成
    });

    console.log(`Job ${job.id} completed successfully`);
  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
    job.moveToFailed({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

export default createSiteQueue;
