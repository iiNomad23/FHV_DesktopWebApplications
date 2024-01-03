window.onload = () => {
    document.getElementById("date-picker").value = new Date().toISOString().split('T')[0];
}