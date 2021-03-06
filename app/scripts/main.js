/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';



const pushButton = document.querySelector('.js-push-btn');
const applicationServerPublicKey = 'BGr8p8O8dZeP3fyabfV_6dxdJ5nslqP1tVXgp3nXK03ySq-dilnae4JB1MaVpAwNuxrjRvB0IxVkTZiDXBNzNJw';
var idUser = location.search.split('idUser=')[1]
console.log("id "+idUser)
let isSubscribed = false;
let swRegistration = null;

//subscriptions functions

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ('serviceWorker' in navigator) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

function initialiseUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      subscribeUser();
     
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function updateBtn() {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}
// llamar a initialiseUI() cuando nuestro service worker está registrado.
navigator.serviceWorker.register('sw.js')
.then(function(swReg) {
  console.log('Service Worker is registered', swReg);

  swRegistration = swReg;
  initialiseUI();
})

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed:', subscription);

    updateSubscriptionOnServer(subscription);
    
    isSubscribed = true;

    updateBtn();
    //insert in bd
    insertSubcription(subscription)
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    
    var sus = JSON.stringify(subscription)
    
    subscriptionJson.textContent = sus;
    subscriptionDetails.classList.remove('is-invisible');


  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

pushButton.addEventListener('click', function() {
  pushButton.disabled = true;
  if (isSubscribed) {
    unsubscribeUser();
  } else {
    subscribeUser();
  }
});

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}



////Consumir de la api


//1 ) consultar usuario
function getUsuairio() {
  var request = new XMLHttpRequest();
  //obtener el id de la url
  
  //consulta de usuario por id en el servidor
  request.open('GET', 'http://169.62.217.179:5000/users/'+usersId, true);
  request.onload = function () {
  var data = JSON.parse(this.response);

      if (request.status >= 200 && request.status < 400) {
     
          console.log(data)
     
         
 
      } else {
          console.log('error');
      }
      
  }
  request.send();

}

///2) guardar la clave de subcripcion

function insertSubcription(subscription){
  var str = JSON.stringify(subscription);
  
  var subscriptionObject = JSON.parse(str);

fetch('http://localhost:5000/addSubscription', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
     subscription_ : subscriptionObject,
     id: idUser

  })
})
.then((response) => {
  if (response.status !== 200) {
    return response.text()
    .then((responseText) => {
      throw new Error(responseText);
    });
  }
});
}