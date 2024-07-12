import Queue from 'bull';

// 创建 Bull 队列实例
const createSiteQueue = new Queue('create-site', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

// 获取并显示任务状态和进度
async function viewQueueStatus() {
  try {
    const activeJobs = await createSiteQueue.getJobs(['active']);
    console.log(`Active Jobs: ${activeJobs.length}`);
    for (const job of activeJobs) {
      console.log(`${job.id} ${job.data}`);
      console.log(`Progress: ${await job.progress()}%`);
    }

    const completedJobs = await createSiteQueue.getJobs(['completed']);
    console.log(`Completed Jobs: ${completedJobs.length}`);
    for (const job of completedJobs) {
      console.log(`${job.id} ${job.data}`);
    }

    const failedJobs = await createSiteQueue.getJobs(['failed']);
    console.log(`Failed Jobs: ${failedJobs.length}`);
    for (const job of failedJobs) {
      console.log(`${job.id} ${job.data}`);
      console.log(`Failed Reason: ${job.failedReason}`);
    }
  } catch (error) {
    console.error('Error retrieving jobs', error);
  }
}

viewQueueStatus().then(() => process.exit());
