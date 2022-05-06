import axios from "axios";

const url = 'http://localhost:5000/api/products/'

const getAllProduct = ()=>{
    let data;
    try {
        axios.get(`${url}/getProducts`).then(res => {
            const persons = res.data;
            data = persons
        })
        return data;
      } catch (err) {
          
       return err
    }
}

export {getAllProduct}