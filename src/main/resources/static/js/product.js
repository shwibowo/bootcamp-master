loadProduct();

function loadProduct() {
    $.ajax({
        url:host + 'api/product',
        type:'GET',
        contentType:'application/json',
        success:function(product) {
            var product = product.Data;
            var strdata = '', iter = 1;
            for(i=0; i<product.length; i++) {
                strdata += `
                <tr>
                    <td>${iter}</td>
                    <td>${product[i].category.name}</td>
                    <td>${product[i].name}</td>
                    <td>${product[i].description}</td>
                    <td>${product[i].price}</td>
                    <td>${product[i].stock}</td>
                    <td>
                        <button class="btn btn-warning" value="${product[i].id}" onclick="openProductEdit(this.value)">Update</button>
                        <button class="btn btn-danger" value="${product[i].id}" onclick="openProductDelete(this.value)">Delete</button>
                    </td>
                </tr>
                `;
                iter++;
            }
            $('#productData').html(strdata);
            new DataTable('#productTable');
        }
    });
}

function categoryList() {
    $.ajax({
        url:host + 'api/category',
        type:'GET',
        contentType:'application/json',
        success:function(category) {
            console.log(category);
            var category = category.Data;
            var strOpt = '';
            for(i=0; i<category.length; i++) {
                strOpt += `<option value="${category[i].id}">${category[i].name}</option>`;
            }
            $('#optCategory').html(strOpt);
        },
        error:function(e) {
            console.log(e);
        }
    });        
}

function productForm(type_) {
    var strForm = `
    <input type="hidden" id="id">
    <span>Category</span><br>
    <span>
        <select class="form-control" id="optCategory">
        </select>
    </span>
    <span>Nama</span><br>
    <span><input type="text" class="form-control" id="name"></span>
    <span>Description</span><br>
    <span><textarea rows="5" class="form-control" id="description"></textarea></span>
    <span>Price</span><br>
    <span><input type="text" class="form-control" id="price"></span>
    <span>Stock</span><br>
    <span><input type="text" class="form-control" id="stock"></span>
    `;
    if(type_=='add') {
        strForm += `
        <div class="d-grid gap-2 my-3">
            <button class="btn btn-success" onclick="saveProduct()">Simpan</button>
        </div>
        `;
    } else {
        strForm += `
        <div class="d-grid gap-2 my-3">
            <button id="buttonUpdateProduct" class="btn btn-success" onclick="updateProduct(this.value)">Update</button>
        </div>
        `;
    }
    return strForm;
}

function openProductForm() {
    $('#mymodal').modal('show');
    $('.modal-title').html('Add Product');
    $('.modal-body').html(productForm('add'));
    categoryList();
}

function openProductEdit(id) {
    $('#mymodal').modal('show');
    $('.modal-title').html('Edit Product');
    $('.modal-body').html(productForm('update'));
    categoryList();

    $.ajax({
        url:host + 'api/product/' + id,
        type:'GET',
        contentType:'application/json',
        success:function(product) {
            console.log(product.Data);
            var product = product.Data;
            $('#optCategory').val(product.categoryId);
            $('#name').val(product.name);
            $('#description').val(product.description);
            $('#price').val(product.price);
            $('#stock').val(product.stock);
            $('#buttonUpdateProduct').val(product.id);
        },
        error:function(e) {
            console.log(e);
        }
    });

}

function openProductDelete(id) {
    $('#mymodal').modal('show');
    $('.modal-title').html('Delete Product');

    $.ajax({
        url:host + 'api/product/' + id,
        type:'GET',
        contentType:'application/json',
        success:function(product) {
            console.log(product.Data);
            var product = product.Data;
            var strProduct = `
                <h3>Anda yakin?</h3>
                <p style="font-family:courier;">
                    <b>Category</b>: &emsp;&emsp;${product.category.name}<br>
                    <b>Name</b>: &emsp;&emsp;&emsp;&emsp;${product.name}<br>
                    <b>Description</b>: &emsp;${product.description}<br>
                    <b>Price</b>: &emsp;&emsp;&emsp;&emsp;${product.price}<br>
                    <b>Stock</b>: &emsp;&emsp;&emsp;&emsp;${product.stock}<br>
                    <br>
                    <button class="btn btn-danger" onclick="deleteProduct(${id})">Delete!</button>
                </p>
            `;
            $('.modal-body').html(strProduct);
        },
        error:function(e) {
            console.log(e);
        }
    });

}


function saveProduct() {
    var dataProduct = {
        categoryId:$('#optCategory').val(),
        name:$('#name').val(),
        description:$('#description').val(),
        price:$('#price').val(),
        stock:$('#stock').val()
    };
    $.ajax({
        url:host + 'api/product',
        type:'POST',
        data:JSON.stringify(dataProduct),
        contentType:'application/json',
        success:function(result) {
            console.log(result);
            location.reload(1);
        },
        error:function(e) {
            console.log(e);
        }
    });    
}

function updateProduct(id) {
    var dataProduct = {
        categoryId:$('#optCategory').val(),
        name:$('#name').val(),
        description:$('#description').val(),
        price:$('#price').val(),
        stock:$('#stock').val()
    };
    $.ajax({
        url:host + 'api/product/'+id,
        type:'PUT',
        data:JSON.stringify(dataProduct),
        contentType:'application/json',
        success:function(result) {
            console.log(result);
            location.reload(1);
        },
        error:function(e) {
            console.log(e);
        }
    });    
}

function deleteProduct(id) {
    $.ajax({
        url:host + 'api/product/'+id,
        type:'DELETE',
        contentType:'application/json',
        success:function(result) {
            console.log(result);
            location.reload(1);
        },
        error:function(e) {
            console.log(e);
        }
    });    
}