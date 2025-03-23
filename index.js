const express = require("express")
const winston = require("winston")

const logger = winston.createLogger({ 
    level: "info", 
    format: winston.format.json(), 
    defaultMeta: { service: "calculator-microservice" }, 
    transports: [ 
        new winston.transports.Console({ 
            format: winston.format.simple(), 
        }), 
        new winston.transports.File({ filename: "logs/error.log", level: "error" }), 
        new winston.transports.File({ filename: "logs/combined.log", format: winston.format.combine(winston.format((info) => {
              if (info.level === "error") {
                return false
              }
              return info
            })(),
            winston.format.json()
          ) 
        }), 
    ], 
});

function handleErrors(operator, num1, num2) 
{
    if (isNaN(num1) || isNaN(num2))
    {
        logger.error("Invalid input: Input parameters are not numbers")
        return 1
    }
    else if (operator == "/" && num2 == 0)
    {
        logger.error("Zero division: Division by 0 is not possible")
        return 2
    }
    else if (num1 > Number.MAX_VALUE || num1 < -Number.MIN_VALUE || num2 > Number.MAX_VALUE || num2 < -Number.MIN_VALUE)
    {
        logger.error("Range exceeded: Input parameters have exceeded min/max range limits")
        return 3
    }
    else
        return 0
}

const app = express()

app.get("/add", (req, res) => {
    var num1 = req.query.num1
    var num2 = req.query.num2
    num1 = parseFloat(num1)
    num2 = parseFloat(num2)
    const validate = handleErrors("+", num1, num2)
    if (validate == 1)
        return res.status(400).json({message: "num1 and num2 must be numbers"})
    else if (validate == 3)
        return res.status(400).json({message: "Either numbers are too large or too small"})
    else
    {
        const result = num1 + num2
        logger.info(`Addition: ${num1} + ${num2} = ${result}`)
        res.json({result})
    }
})

app.get("/sub", (req, res) => {
    var num1 = req.query.num1
    var num2 = req.query.num2
    num1 = parseFloat(num1)
    num2 = parseFloat(num2)
    const validate = handleErrors("-", num1, num2)
    if (validate == 1)
        return res.status(400).json({message: "num1 and num2 must be numbers"})
    else if (validate == 3)
        return res.status(400).json({message: "Either numbers are too large or too small"})
    else
    {
        const result = num1 - num2
        logger.info(`Subtraction: ${num1} - ${num2} = ${result}`)
        res.json({result})
    }
})

app.get("/mul", (req, res) => {
    var num1 = req.query.num1
    var num2 = req.query.num2
    num1 = parseFloat(num1)
    num2 = parseFloat(num2)
    const validate = handleErrors("*", num1, num2)
    if (validate == 1)
        return res.status(400).json({message: "num1 and num2 must be numbers"})
    else if (validate == 3)
        return res.status(400).json({message: "Either numbers are too large or too small"})
    else
    {
        const result = num1 * num2
        logger.info(`Multiplication: ${num1} * ${num2} = ${result}`)
        res.json({result})
    }
})

app.get("/div", (req, res) => {
    var num1 = req.query.num1
    var num2 = req.query.num2
    num1 = parseFloat(num1)
    num2 = parseFloat(num2)
    const validate = handleErrors("/", num1, num2)
    if (validate == 1)
        return res.status(400).json({message: "num1 and num2 must be numbers"})
    else if (validate == 2)
        return res.status(400).json({message: "Denominator cannot be 0 in division"})
    else if (validate == 3)
        return res.status(400).json({message: "Either numbers are too large or too small"})
    else
    {
        const result = num1 / num2
        logger.info(`Division: ${num1} / ${num2} = ${result}`)
        res.json({result})
    }
})

app.listen(3000, () => {
    logger.info("Calculator microservice running on http://localhost:3000")
})