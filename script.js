let cont = document.querySelector('.container')
let form = document.forms.sub;
let baseUrl = 'http://localhost:3000'
const getAllData = async () => {
  const res = await fetch(baseUrl + '/todos')

  if (res.status === 200 || res.status === 201) {
    const data = await res.json()

    create(data, cont)
  } else {
    alert('Connection error')
  }
}

getAllData()

function create(arr, place) {
  place.innerHTML = ''
  for (let itemm of arr) {
    let item = document.createElement("div");
    let two = document.createElement("div");
    let h1 = document.createElement("h1");
    let del = document.createElement("img");
    let edit = document.createElement('img')
    let p = document.createElement("p");

    item.classList.add("item");
    two.classList.add("two");

    item.style.scale = '0.5'
    setTimeout(() => {
      item.style.transition = '1s ease'
      item.style.scale = '1'
    }, 100);

    del.src = "./img/close.svg";
    edit.src = "./img/edit (1).svg";
    h1.innerHTML = itemm.task;
    p.innerHTML = itemm.time;

    if (itemm.isDone === true) {
      h1.classList.add('active')
    }

    h1.onclick = () => {
      itemm.isDone = !itemm.isDone
    }

    del.onclick = async () => {
      const res = await fetch(baseUrl + "/todos/" + itemm.id, {
        method: "delete"
      })

      if (res.status === 200 || res.status === 201) {
        item.style.scale = '0.5'
        item.style.transition = '1s ease'
        item.remove()
      }
    }

    edit.onclick = async () => {
      let editText = prompt()

      const res = await fetch(baseUrl + "/todos/" + itemm.id, {
        method: 'PATCH',
        body: JSON.stringify({
          task: editText,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      })
      getAllData()
    }

    item.append(two, p);
    two.append(h1, del, edit);
    place.append(item);
  }
}

form.onsubmit = (event) => {
  event.preventDefault();

  let task = {
    id: Math.random(),
    isDone: false,
    time: new Date().getHours() + ":" + new Date().getMinutes()
  };

  let fm = new FormData(form)

  fm.forEach((value, key) => {
    task[key] = value;
  });

  createNewTask(task)
};

const createNewTask = (body) => {
  fetch(baseUrl + '/todos', {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (res.status === 200 || res.status === 201) {
        getAllData()
      }
    })
}