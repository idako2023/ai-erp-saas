import Queue from 'bull';

const createSiteQueue = new Queue('create-site', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

async function viewJobs() {
  try {
    // 获取所有状态的任务
    const completedJobs = await createSiteQueue.getJobs(['completed']);
    const failedJobs = await createSiteQueue.getJobs(['failed']);
    const delayedJobs = await createSiteQueue.getJobs(['delayed']);
    const waitingJobs = await createSiteQueue.getJobs(['waiting']);
    const activeJobs = await createSiteQueue.getJobs(['active']);

    // 打印任务信息
    console.log('Completed Jobs:', completedJobs.length);
    completedJobs.forEach(job => console.log(job.id, job.data, job.returnvalue));

    console.log('Failed Jobs:', failedJobs.length);
    failedJobs.forEach(job => console.log(job.id, job.data, job.failedReason));

    console.log('Delayed Jobs:', delayedJobs.length);
    delayedJobs.forEach(job => console.log(job.id, job.data));

    console.log('Waiting Jobs:', waitingJobs.length);
    waitingJobs.forEach(job => console.log(job.id, job.data));

    console.log('Active Jobs:', activeJobs.length);
    activeJobs.forEach(job => console.log(job.id, job.data));

  } catch (error) {
    console.error('Error retrieving jobs', error);
  }
}

// 执行查看任务的函数
viewJobs().then(() => process.exit());
