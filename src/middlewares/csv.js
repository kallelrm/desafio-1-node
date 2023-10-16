import { parse } from 'csv-parse';
import fs from 'fs/promises'

(async () => {
    let count = 0;
    const file = await fs.readFile(new URL('../../file.csv', import.meta.url))
    const parsedcsv = parse(file)

    // Report start
    process.stdout.write('start\n');
    // Iterate through each records
    for await (const record of parsedcsv) {
        if (count === 0) {
            count++
            continue
        }
        const [title, description] = record
        console.log(title, description)
        // Report current line
        fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ title, description }),
        }).then(response => {
            return response.text()
        }).then(data => {
            console.log(data)
        });
    }
    process.stdout.write('...done\n');
    // Validation
})();