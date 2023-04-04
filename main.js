

var x = 0;
var y = 0;






		document.querySelector("body").addEventListener(
					"mousemove", function (event) {
            
 
//Takes the mouse movement we listened for and saves it into two variables
  x = event.clientX;
  y = event.clientY;

			document.body.style.backgroundColor = 'rgb(' + x + ', ' + y + ', 100)'; 
  //By writing variable + ', ' we combine the value with text to make it write like rgb(x, y, 100); when sent to style part (css)
  //Adds a text element to the page. It writes out the x & y value
		})

   