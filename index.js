// Import required packages
const express = require("express")
const winston = require("winston")

/*
Configure Winston logger with three transports:
1. Console: For development visibility (all levels)
2. Error log file: For storing error messages only
3. Combined log file: For storing all non-error messages
*/
const logger = winston.createLogger({ 
    level: "info", 
    format: winston.format.json(), 
    defaultMeta: { service: "calculator-microservice" }, 
    transports: [
        // Console logging with simple formatting
        new winston.transports.Console({ 
            format: winston.format.simple(), 
        }),
        // Error log file - only logs error level messages
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        // Combined log file - excludes error messages using custom formatter
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

/**
Error handling function that validates inputs and checks for common error cases

@param {string} operator - The arithmetic operator ("+", "-", "*", "/")
@param {number} num1 - The first operand
@param {number} num2 - The second operand
@returns {number} Error code: 0=no error, 1=invalid number, 2=division by zero, 3=number too large/small
*/
function handleErrors(operator, num1, num2) 
{
    // Check if inputs are valid numbers
    if (isNaN(num1) || isNaN(num2))
    {
        logger.error("Invalid input: Input parameters are not numbers")
        return 1
    }
    // Check for division by zero
    else if (operator == "/" && num2 == 0)
    {
        logger.error("Zero division: Division by 0 is not possible")
        return 2
    }
    // Check if numbers exceed JavaScript's safe number range
    else if (num1 > Number.MAX_VALUE || num1 < -Number.MIN_VALUE || num2 > Number.MAX_VALUE || num2 < -Number.MIN_VALUE)
    {
        logger.error("Range exceeded: Input parameters have exceeded min/max range limits")
        return 3
    }
    // No errors detected
    else
        return 0
}

// Initialize Express application
const app = express()

/*
Addition endpoint - Adds two numbers
URL: /add?num1=x&num2=y
*/
app.get("/add", (req, res) => {
    // Extract and parse query parameters
    var num1 = req.query.num1
    var num2 = req.query.num2
    num1 = parseFloat(num1)
    num2 = parseFloat(num2)
    // Handle validation errors
    const validate = handleErrors("+", num1, num2)
    if (validate == 1)
        return res.status(400).json({message: "num1 and num2 must be numbers"})
    else if (validate == 3)
        return res.status(400).json({message: "Either numbers are too large or too small"})
    else
    {
        // Perform addition and log the operation
        const result = num1 + num2
        logger.info(`Addition: ${num1} + ${num2} = ${result}`)
        // Return result as JSON
        res.json({result})
    }
})

/*
Subtraction endpoint - Subtracts second number from first
URL: /sub?num1=x&num2=y
*/
app.get("/sub", (req, res) => {
    // Extract and parse query parameters
    var num1 = req.query.num1
    var num2 = req.query.num2
    num1 = parseFloat(num1)
    num2 = parseFloat(num2)
    // Handle validation errors
    const validate = handleErrors("-", num1, num2)
    if (validate == 1)
        return res.status(400).json({message: "num1 and num2 must be numbers"})
    else if (validate == 3)
        return res.status(400).json({message: "Either numbers are too large or too small"})
    else
    {
        // Perform subtraction and log the operation
        const result = num1 - num2
        logger.info(`Subtraction: ${num1} - ${num2} = ${result}`)
        // Return result as JSON
        res.json({result})
    }
})

/*
Multiplication endpoint - Multiplies two numbers
URL: /mul?num1=x&num2=y
*/
app.get("/mul", (req, res) => {
    // Extract and parse query parameters
    var num1 = req.query.num1
    var num2 = req.query.num2
    num1 = parseFloat(num1)
    num2 = parseFloat(num2)
    // Handle validation errors
    const validate = handleErrors("*", num1, num2)
    if (validate == 1)
        return res.status(400).json({message: "num1 and num2 must be numbers"})
    else if (validate == 3)
        return res.status(400).json({message: "Either numbers are too large or too small"})
    else
    {
        // Perform multiplication and log the operation
        const result = num1 * num2
        logger.info(`Multiplication: ${num1} * ${num2} = ${result}`)
        // Return result as JSON
        res.json({result})
    }
})

/*
Division endpoint - Divides first number by second
URL: /div?num1=x&num2=y
*/
app.get("/div", (req, res) => {
    // Extract and parse query parameters
    var num1 = req.query.num1
    var num2 = req.query.num2
    num1 = parseFloat(num1)
    num2 = parseFloat(num2)
    // Handle validation errors
    const validate = handleErrors("/", num1, num2)
    if (validate == 1)
        return res.status(400).json({message: "num1 and num2 must be numbers"})
    else if (validate == 2)
        return res.status(400).json({message: "Denominator cannot be 0 in division"})
    else if (validate == 3)
        return res.status(400).json({message: "Either numbers are too large or too small"})
    else
    {
        // Perform division and log the operation
        const result = num1 / num2
        logger.info(`Division: ${num1} / ${num2} = ${result}`)
        // Return result as JSON
        res.json({result})
    }
})

// Start the Express server on port 3000
app.listen(3000, () => {
    logger.info("Calculator microservice running on http://localhost:3000")
})