function generatePDF(){
const elem=document.getElementById("right");
html2pdf()
.from(elem)
.save();


}