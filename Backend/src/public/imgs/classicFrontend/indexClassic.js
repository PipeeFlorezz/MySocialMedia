/*file.addEventListener('change', function () {
    console.log(this.files[0]);
    form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        let formData = new FormData();

        formData.append('avatar', this.files[0]);

        fetch('http://localhost:3000/users/subirImagen', {
            method: 'PUT',
            body: formData
        })
            .then(response => response.json())
            .then(response => console.log('Success:', response))
            .catch(error => console.error('Error:', error))
    });
})*/
console.log('Javascript desde la carpeta Public')
let file = document.querySelector("input[type='file']")
let form = document.querySelector('#form');
console.log(file, form);
let obj = {coment: 'Guitarra', lastname: 'Cardona'};
file.addEventListener('change', async function(){
    console.log(document.querySelector("input[type='file']").value);
    console.log(document.querySelector('#comment').value)
    let formData = new FormData();
    console.log(this.files[0]);
    formData.append('image', this.files[0]);

    /*await fetch('http://localhost:3000/users/subirImagen', {
    method: 'PUT',
    body: formData,
    headers: {
        'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTdiNTk2ZWU3OWZjOWRiNjNjMTIyZCIsImlhdCI6MTY0NTcyMDk4Mn0.vjDf_xnuOyA1845_wVn65_k64C41u3xqspQC8IfEkRs'
      }
})
    .then(response => response.json())
    .then(response => console.log('Success:', response))
    .catch(error => console.error('Error:', error))*/

    fetch('http://localhost:3000/comments/addComment', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTgxODg0YjM5M2U5ODQwYzhhMTM2YyIsImlhdCI6MTY0NTgzMTkwNn0.bbaflgMpNIEKdYv8GfHw7E_MSjFb3YU5utkLma0Rq5o',
            'Content-Type': 'application/json'
          }
    })
        .then(response => response.json())
        .then(response => console.log('Success:', response.addComent))
        .catch(error => console.error('Error:', error))
    
    console.log('Culquier ejecucion despues de la peticion fetch');
    ///document.querySelector("input[type='file']").files[0].name;

});


