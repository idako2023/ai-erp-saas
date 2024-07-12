import Queue from 'bull';

const createSiteQueue = new Queue('create-site', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

async function removeJob(jobId) {
  try {
    const job = await createSiteQueue.getJob(jobId);
    if (job) {
      await job.remove();
      console.log(`Job ${jobId} removed`);
    } else {
      console.log(`Job ${jobId} not found`);
    }
  } catch (error) {
    console.error('Error removing job', error);
  }
}

// 替换为你要删除的任务 ID
const jobIdToRemove = 5;

removeJob(jobIdToRemove).then(() => process.exit());
