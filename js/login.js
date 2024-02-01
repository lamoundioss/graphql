var btn = document.getElementById('login')
const emailElement = document.querySelector('.form-group input[type="email"]')
const passwordElement = document.querySelector('.form-group input[type="password"]')
const signinEndpoint = 'https://learn.zone01dakar.sn/api/auth/signin';
const graphqlEndpoint = 'https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql'

var emailValue;
var passwordValue;
export var datas;
if (btn) {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (emailElement && passwordElement) {
      emailValue = emailElement.value
      passwordValue = passwordElement.value
      //window.location.href = "/index.html"
      const credentials = {
        username: emailValue,
        password: passwordValue,
      };
      if (emailValue && passwordValue) {
        signIn(credentials)
      }else{
        document.getElementById('messageErr').style.display = 'block'
      }
    }
  })
  //document.querySelector('.log').style.backgroundColor = '#9969ff'
}


function signIn(credentials) {
  const utf8Bytes = new TextEncoder().encode(`${credentials.username}:${credentials.password}`);
  const basicAuth = btoa(String.fromCharCode.apply(null, utf8Bytes));
  fetch(signinEndpoint, {
    method: 'POST',
    headers: {  
      'Content-Type': 'application/json',
      'Authorization': `Basic ${basicAuth}`,
      //'Authorization': `Basic ${basicAuth}`,
    },
    body: JSON.stringify(),
  })
    .then(response => {
      if (!response.ok) {
        document.getElementById('messageErr').style.display = 'block'
        console.log(document.getElementById('messageErr'));
        throw new Error(`Signin request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      getData(data)
    })
    .catch(error => {

      console.error('Signin request error:', error);
    });
}

function getData(jwt) {
  const graphqlQuery = `
    query {
        user {
            firstName
            lastName
            campus
            login
            email
            totalUp
            totalDown
            auditRatio
          }
          
          #recuperer le level du user
          level:transaction(where:{
            type:{
              _eq:"level"
            },
            path:{
              _like: "%/dakar/div-01%"
            }
          }
          order_by:{amount:desc} 
          limit:1
          ){
            type
            amount
          }
          #recuperer les 15 plus gros projets et leur xp
          xp:transaction(where:{type:{_eq:"xp"}, event:{object:{type:{_eq:"module"}}}}
          order_by: { amount: desc}
          limit:10){
            object{
              name
              type
            }
            createdAt
            path
            amount
          }
          #recuperer le montant d'xp
          kb:transaction_aggregate (where:{
            type:{_eq:"xp"}
            event:{
              object:{
                type:{_eq: "module"}
              }
            }
          }){
               aggregate{
              sum{
                amount
              }
            }
          }
          progress:transaction(where: {_and:[{type:{_eq:"xp"}, event:{object:{type:{_eq:"module"}}}}]},
          order_by:{createdAt: asc}){
            type
            amount
            object{
              name
            }
            createdAt
          }
    }
  `;
  fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: graphqlQuery }),
  })
    .then(graphqlResponse => graphqlResponse.json())
    .then(graphqlData => {
      window.location.href = "/index.html"
      console.log('GraphQL response:', graphqlData);
      const jsonData = JSON.stringify(graphqlData);
      localStorage.setItem("data", jsonData);
      datas = jsonData
    })
    .catch(graphqlError => {

      console.error('GraphQL request error:', graphqlError);
    });
}
