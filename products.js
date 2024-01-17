import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.13/vue.esm-browser.min.js';


// model
let productMyModal = null;
let delMyModal = null;
// 刪除
// const delModal = document.querySelector("#delProductModal")


const app = createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io',
            path: 'wei_rio',
            // 抓api的資料
            products: [],
            // 用於判斷是 『新增 ＆ 編輯』
            isNew: false,
            //蒐集當下資料『新增 ＆ 編輯』
            tempProduct: {
                imagesUrl: [],
            }
        }
    },
    methods: {
        // 判斷帳號登入成功才把資料取出來
        checkUser() {
            const url = `${this.apiUrl}/v2/api/user/check`
            axios.post(url)
                .then(res => {
                    // alert("登入成功囉～")x
                    this.getData()
                })
                .catch(err => {
                    alert(err.data.message)
                    window.location = "login.html"
                })
        },
        // 取得後台資料
        getData() {
            const url = `${this.apiUrl}/v2/api/${this.path}/admin/products`
            axios.get(url)
                .then(res => {
                    // console.log(res);
                    this.products = res.data.products;
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        // 新增商品
        // addData() {
        //     const url = `${this.apiUrl}/v2/api/${this.path}/admin/product`
        //     axios.post(url, { data: this.tempProduct })
        //         .then(res => {
        //             alert(res.data.message);
        //             productMyModal.hide();
        //             this.getData();
        //         })
        //         .catch(err => {
        //             alert(err.data.message);
        //         })
        // },

        // 編輯商品
        // editData() {
        //     const url = `${this.apiUrl}/v2/api/${this.path}/admin/product/${this.tempProduct.id}`
        //     axios.put(url)
        //         .then(res => {
        //             console.log(res)
        //             productMyModal.hide();
        //             this.getData();
        //         })
        //         .catch(err => {
        //             alert(err.data.message)
        //         })
        // },

        // 整合 編輯 ＆ 新增
        updateData() {
            let url = `${this.apiUrl}/v2/api/${this.path}/admin/product`;
            let http = 'post';

            // 利用 isNew 來確認是哪個功能 true ＝post新增  false = put修改
            if (!this.isNew) {
                // console.log(this.isNew)
                url = `${this.apiUrl}/v2/api/${this.path}/admin/product/${this.tempProduct.id}`
                http = 'put';
            }
            axios[http](url,{data:this.tempProduct})
            .then((res)=>{
                alert(res.data.message);
                productMyModal.hide();
                this.getData()
            })
            .catch((err)=>{
                alert(err.data.message)
            })
        },

        // 刪除商品
        removeData() {
            const url = `${this.apiUrl}/v2/api/${this.path}/admin/product/${this.tempProduct.id}`
            axios.delete(url)
                .then(res => {
                    // console.log(res)
                    delMyModal.hide()
                    this.getData()
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 控制modal事件
        openModal(modalStatus, item) {
            // 新增
            if (modalStatus === 'add') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true,
                    productMyModal.show();
            } else if (modalStatus === 'edit') {
                this.tempProduct = { ...item };
                this.isNew = false,
                    productMyModal.show();

            } else if (modalStatus === "del") {
                this.tempProduct = { ...item };
                delMyModal.show()
            }
        },
        // 彈出刪除畫面【Modal】
        // delMyModalBtn() {
        //     this.tempProduct =
        //         delMyModal.show()
        // },
        // 彈出新增畫面【Modal】
        // addModalBtn() {
        //     addMyModal.show();
        // },
        // 新增多張圖片
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('')
        }
    },
    mounted() {
        // 取出token
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)hexSchool\s*\=\s*([^;]*).*$)|^.*$/,
            "$1",
        );
        //  當axios 發出api請求時 自動全部將header加入上去
        axios.defaults.headers.common['Authorization'] = token;
        //當網頁都準備好去執行【確認帳號是正常的】
        this.checkUser()
        productMyModal = new bootstrap.Modal(document.querySelector("#productModal"));
        delMyModal = new bootstrap.Modal(document.querySelector("#delProductModal"));
    },
})

app.mount('#app')