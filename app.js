require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const databaseMiddleware = require('./middleware/database-middleware');
const authenticationMiddleware = require('./middleware/authentication-middleware');
const authRouter = require('./routes/auth-router.js');
const { adminRouter } = require('./routes/admin-router.js');
const { userRouter } = require('./routes/user-router.js');

const swaggerUi = require('swagger-ui-express')
const yaml = require('yaml')
const fs = require('fs');
const openApiPath = './docs/apiDocs.yaml'
const file = fs.readFileSync(openApiPath, 'utf8')
const swaggerDocument = yaml.parse(file)

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(databaseMiddleware);

app.use('/v1/auth', authRouter);
app.use('/v1/user', authenticationMiddleware, userRouter);
app.use('/v1/admin', authenticationMiddleware, adminRouter);

app.listen(port, () => {
    console.log(`Running on localhost: ${port}`);
})