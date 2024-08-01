$('#newOrderButton').prop('disabled', true)
$('#paymentButton').prop('disabled', true)

function newTrans() {
    const dataHeader = {
        reference:Date.now(),
        amount:0.0
    }

    $.ajax({
        url:host + 'apitrans/orderheader/save',
        type:'POST',
        data:JSON.stringify(dataHeader),
        contentType:'application/json',
        success:function(orderheader) {
            $('#reference_no').val(orderheader.reference);
            $('#header_id').val(orderheader.id);
            $('#newOrderButton').prop('disabled', false)
            $('#newTransButton').prop('disabled', true)
        }
    })
}

function newOrder() {
    $('#mymodal').modal('show')
    $('.modal-title').html('New Order')

    $.ajax({
        url:host + 'apitrans/product',
        type:'GET',
        contentType:'application/json',
        success:function(product) {
            //product = product.Data;
            var strProduct = `
                <button class="btn btn-danger" onclick="selesai()">Selesai</button>
                <table class="table">
                <thead>
                    <tr>
                        <th colspan="3">Qty:&nbsp;<input type="number" id="qty" value="1"></th>
                        <th align="right" colspan="2">
                        <input type="text" size="7" id="search" placeholder="Search" oninput="getSearch(this.value)">
                        </th>
                    </tr>
                    <tr>
                        <th>button</th>
                        <th>Product</th>
                        <th>Desc</th>
                        <th>Price</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody id="listProduct">
            `;
            for(i=0; i<product.length; i++) {
                strProduct += `
                    <tr>
                        <td>
                            <button value="${product[i].id}" class="btn btn-success" onclick="saveDetail(this.value)">
                            <i class="fa fa-check"></i>
                            </button>
                        </td>
                        <td>${product[i].name}</td>
                        <td>${product[i].description}</td>
                        <td align="right">${product[i].price}</td>
                        <td align="right">${product[i].stock}</td>
                    </tr>
            `;
            }
            strProduct += `</tbody></table>`;
            $('.modal-body').html(strProduct);
        }
    })
    
}


function saveDetail(product_id) {
    var priceTemp = 0.0;
    $.ajax({
        url:host + 'apitrans/product/' + product_id,
        type:'GET',
        contentType:'application/json',
        async:false,
        success:function(price) {
            console.log(price)
            priceTemp = price
            loadOrderDetailByHeader()
        }
    })

    const dataDetail = {
        headerId:$('#header_id').val(),
        productId:product_id,
        quantity:$('#qty').val(),
        price:priceTemp
    }

    $.ajax({
        url:host + 'apitrans/orderdetail/save',
        type:'POST',
        data:JSON.stringify(dataDetail),
        contentType:'application/json',
        success:function(orderdetail) {
            console.log(orderdetail)
            updateStock(dataDetail.productId, -dataDetail.quantity);
            loadOrderDetailByHeader()
        }
    })
}

function updateStock(pid, qty) {
    $.ajax({
        url:host + 'apitrans/product/updateStock/' + pid + "/" + qty,
        type:'PATCH',
        contentType:'application/json',
        success:function(product) {
            console.log(product)
        }
    })    
}

const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(number);
};

function loadOrderDetailByHeader() {
    $.ajax({
        url:host + 'apitrans/orderdetail/' + $('#header_id').val(),
        type:'GET',
        contentType:'application/json',
        success:function(orderdetail) {
            console.log(orderdetail)
            var dataDetail = '', totalQty = 0, totalAmount = 0;
            for(i=0; i<orderdetail.length; i++) {
                totalQty += orderdetail[i].quantity;
                totalAmount += orderdetail[i].quantity * orderdetail[i].price;
                dataDetail += `
                    <tr>
                    <td>${orderdetail[i].product.name}</td>
                    <td align="right">${rupiah(orderdetail[i].price)}</td>
                    <td align="center">${orderdetail[i].quantity}</td>
                    <td align="right">${rupiah(orderdetail[i].quantity * orderdetail[i].price)}</td>
                    <td>
                        <button class="btn btn-danger" onclick="deleteOrderDetail(${orderdetail[i].id}, ${orderdetail[i].product.id}, ${orderdetail[i].quantity})">
                        <i class="fa fa-trash"></i>
                        </button>
                    </td>
                    </tr>
                `;
            }
            dataDetail += `<tr>
            <td colspan="2">Total</td>
            <td align="center">${totalQty}</td>
            <td align="right">
                ${rupiah(totalAmount)}
                <input type="hidden" value="${totalAmount}" id="totalAmount">
            </td>
            <td></td>
            </tr>`
            $('#orderDetailData').html(dataDetail);
        }
    })    
}

function getSearch(textSearch) {
    if(!textSearch) {
        textSearch = '_';
    }
    $.ajax({
        url:host + 'apitrans/product/search/' + textSearch,
        type:'GET',
        contentType:'application/json',
        success:function(product) {
            console.log(product)
            var strProduct = ''
            for(i=0; i<product.length; i++) {
                strProduct += `
                    <tr>
                        <td>
                            <button value="${product[i].id}" class="btn btn-success" onclick="saveDetail(this.value)">
                            <i class="fa fa-check"></i>
                            </button>
                        </td>
                        <td>${product[i].name}</td>
                        <td>${product[i].description}</td>
                        <td align="right">${product[i].price}</td>
                        <td align="right">${product[i].stock}</td>
                    </tr>
            `;
            }
            $('#listProduct').html(strProduct);
       }

    });
}

function selesai() {
    $('#mymodal').modal('hide')
    $('#newOrderButton').prop('disabled', true)
    $('#paymentButton').prop('disabled', false)
}

function payment() {
    $('#mymodal').modal('show')
    $('.modal-title').html("Payment")

    const payModal = `
    Reference : <br>
    <input type="text" id="reference" class="form-control" disabled><br>
    Amount : <br>
    <input type="text" id="amount" class="form-control" disabled><br>
    Pay Money : <br>
    <input type="text" id="paymoney" class="form-control" oninput="calculateChange(this.value)"><br>
    Change : <br>
    <input type="text" id="change" class="form-control" disabled><br><br>
    <button class="btn btn-warning" data-bs-toggle="modal">Cancel</button>
    <button class="btn btn-success" onclick="pay()">Pay!</button>
    `;
    $('.modal-body').html(payModal)
    let totalAmount = $('#totalAmount').val()
    $('#amount').val(totalAmount);
}

function calculateChange(pay) {
    const tamount = $('#amount').val();
    let change = pay - tamount;
    $('#change').val(change);
}

function pay() {
    $('#mymodal2').modal('show')
    $('#modal-title').html("Payment")

    const payModal = `
    Reference : <br>
    <input type="text" id="reference2" class="form-control" disabled><br>
    Amount : <br>
    <input type="text" id="amount2" class="form-control" disabled><br>
    Pay Money : <br>
    <input type="text" id="paymoney2" class="form-control" oninput="calculateChange(this.value)" disabled><br>
    Change : <br>
    <input type="text" id="change2" class="form-control" disabled><br><br>
    <button class="btn btn-warning" onclick="close_()">Close</button>
    `;
    $('#modal-body').html(payModal)
    let reference = $('#reference_no').val()
    let totalAmount = $('#totalAmount').val()
    let paymoney = $('#paymoney').val()
    let change = $('#change').val()
    $('#amount2').val(totalAmount);
    $('#reference2').val(reference);
    $('#paymoney2').val(paymoney);
    $('#change2').val(change);

    let header_id = $('#header_id').val()
    $.ajax({
        url:host + 'apitrans/orderheader/updateAmount/' + header_id + "/" + totalAmount,
        type:'PATCH',
        contentType:'application/json',
        success:function(orderheader) {
            console.log(orderheader)
        }
    })
}

function close_() {
    $('#mymodal').modal('hide')
    $('#mymodal2').modal('hide')
}

function deleteOrderDetail(id, pid, qty) {
    $.ajax({
        url:host + 'apitrans/orderdetail/delete_/' + id,
        type:'DELETE',
        contentType:'application/json',
        success:function(orderdetail) {
            console.log(orderdetail)
            updateStock(pid, qty);
            loadOrderDetailByHeader($('#header_id').val());
        }
    })    
}