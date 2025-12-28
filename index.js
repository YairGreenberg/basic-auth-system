
import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());

const validateUser = async (username, password) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single(); 

    return { isValid: !!data, error };
};


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Please provide username and password");
    }

    const { isValid } = await validateUser(username, password);

    if (isValid) {
        res.send(" Login successful");
    } else {
        res.status(401).send(" Wrong username or password");
    }
});

app.get('/products', async (req, res) => {
    const { username, password } = req.body;

    const { isValid } = await validateUser(username, password);

    if (!isValid) {
        return res.status(401).send("Unauthorized");
    }

    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(products);
});

app.listen(port, () => {
    console.log(` Server is running on http://localhost:${port}`);
});
