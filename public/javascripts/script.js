

function addToCart(proId){
    $.ajax({
        url:"/add-to-cart/"+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                $("#cart-count").html(count)
            }
            //alert(response)
        }
    })
}

  
function removeProduct(cartId, proId) {
    //  let quantity=parseInt(document.getElementById(proId).innerHTML)
      //count=parseInt(count)
      $.ajax({
          url: '/remove-product',
          data: {
              cart: cartId,
              product: proId,
              
          },
          method:'post',
         success:(response)=>{
              if(response.removeProduct){
                  alert("product removed from cart")
                location.reload()
              }
          
          }
      })
  }