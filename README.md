# sit737-2025-prac4p

## Prerequisites
To run this microservice, you need to have the following installed:
- Node.js
- npm

## Installation
- Clone the repository:
```git clone https://github.com/s224021028/sit737-2025-prac4p.git```
- Initialize the project:
```npm init```
- Install dependencies:
```npm install express winston```

## Running the Microservice
Start the server with:
```node index.js```
<br>
The server will run on port 3000 by default and log a startup message.

## Testing the Microservice
<b>To test the microservice, you can:</b>
- Addition: http://localhost:3000/add?num1=5&num2=3
- Subtraction: http://localhost:3000/sub?num1=10&num2=4
- Multiplication: http://localhost:3000/mul?num1=6&num2=7
- Division: http://localhost:3000/div?num1=20&num2=5

<b>Check the logs:</b>
- Console output for all logs during development
- logs/error.log for error messages
- logs/combined.log for all non-error messages
