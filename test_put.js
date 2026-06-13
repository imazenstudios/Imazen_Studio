const http = require('http');

async function test() {
  const fetchOptions = {
    method: 'GET',
  };
  
  const res = await fetch('http://localhost:5000/api/services');
  const services = await res.json();
  const service = services[0];
  
  console.log("Before: ", service.subServices[0].heroImage);
  
  service.subServices[0].heroImage = "https://example.com/test-hero.jpg";
  
  const putRes = await fetch(`http://localhost:5000/api/services/${service._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(service)
  });
  
  const putData = await putRes.json();
  console.log("PUT Response heroImage:", putData.subServices[0].heroImage);
  
  const res2 = await fetch('http://localhost:5000/api/services');
  const services2 = await res2.json();
  console.log("After: ", services2[0].subServices[0].heroImage);
}

test();
