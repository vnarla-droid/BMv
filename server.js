const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('Server is running');
});

// Endpoint to handle checkout
app.post('/checkout', async (req, res) => {
    try {
        const order = req.body;
        if (!order || !order.customer || !order.cart) {
            return res.status(400).json({ error: 'Invalid order data' });
        }

        // Read existing orders
        let orders = [];
        try {
            const fileData = await fs.readFile('orders.json', 'utf8');
            orders = JSON.parse(fileData);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error('Error reading orders.json:', error);
                return res.status(500).json({ error: 'Failed to read orders' });
            }
            // File doesn't exist, start with empty array
            orders = [];
        }

        // Add new order
        orders.push(order);

        // Write back to file
        try {
            await fs.writeFile('orders.json', JSON.stringify(orders, null, 2));
            console.log('Order saved:', order);
            res.status(200).json({ message: 'Order received' });
        } catch (error) {
            console.error('Error writing to orders.json:', error);
            return res.status(500).json({ error: 'Failed to save order' });
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});