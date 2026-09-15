const fs = require('fs');
const path = require('path');

const files = [
  "c:\\My-projects\\techloom-intern-assessment\\task-02\\frontend\\src\\components\\PaymentModal.tsx",
  "c:\\My-projects\\techloom-intern-assessment\\task-02\\frontend\\src\\app\\product\\[id]\\page.tsx",
  "c:\\My-projects\\techloom-intern-assessment\\task-02\\frontend\\src\\app\\page.tsx",
  "c:\\My-projects\\techloom-intern-assessment\\task-02\\frontend\\src\\app\\orders\\page.tsx",
  "c:\\My-projects\\techloom-intern-assessment\\task-02\\frontend\\src\\app\\checkout\\page.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/http:\/\/localhost:5000/g, "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}");
  fs.writeFileSync(file, content);
  console.log('Updated', file);
}
