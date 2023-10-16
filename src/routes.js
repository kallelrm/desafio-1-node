import { buildRoutePath } from './utils/build-route-path.js';
import { randomUUID } from 'crypto'
import { Database } from './database.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;

            const tasks = database.select('tasks', search ? {
                id: search,
                title: search,
            } : null)
            return res
                .end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            console.log(req.body)
            const { title, description } = req.body;

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert('tasks', task);
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body;

            database.update('tasks', id, { title, description })
            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            database.delete('tasks', id)
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            // console.log(id)
            const [{title, description, created_at}] = database.select('tasks', { id });
            database.update('tasks', id, { title, description, completed_at: new Date(), created_at, updated_at: new Date() })
            return res.writeHead(204).end()
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks/import-csv'),
        handler: async (req, res) => {
            const buffers = [];

            for await (const chunk of req) {
                buffers.push(chunk);
            }

            const fullStreamContent = Buffer.concat(buffers).toString();

            console.log(fullStreamContent)

            return res.end('success');
        }
    }
]