import { Queue } from "bullmq";

const connection = {
    host: 'paybank-redis',
    port: 6379,   
}

const queueName = 'twoFactorQueue'

const queue = new Queue(queueName, {connection})

const getJog = async () => {
    const jobs = queue.getJobs()
    return jobs[0]
}

export const cleanJobs = async () => {
    await queue.obliterate({force:true})
}