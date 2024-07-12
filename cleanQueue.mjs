import Queue from 'bull';

const createSiteQueue = new Queue('create-site', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

// 清理成功的任务
createSiteQueue.clean(1000 * 1 * 10, 'completed').then(() => {
  console.log('Completed jobs cleaned');
}).catch(err => {
  console.error('Error cleaning completed jobs', err);
});

// 清理失败的任务
createSiteQueue.clean(1000 * 1 * 10, 'failed').then(() => {
  console.log('Failed jobs cleaned');
}).catch(err => {
  console.error('Error cleaning failed jobs', err);
});

// 清理延迟的任务
createSiteQueue.clean(1000 * 1 * 10, 'delayed').then(() => {
  console.log('Delayed jobs cleaned');
}).catch(err => {
  console.error('Error cleaning delayed jobs', err);
});

// 清理所有的等待任务
createSiteQueue.clean(1000 * 1 * 10, 'wait').then(() => {
  console.log('Waiting jobs cleaned');
}).catch(err => {
  console.error('Error cleaning waiting jobs', err);
});

// 清理活跃的任务
createSiteQueue.clean(1000 * 1 * 10, 'active').then(() => {
  console.log('Active jobs cleaned');
}).catch(err => {
  console.error('Error cleaning active jobs', err);
});
