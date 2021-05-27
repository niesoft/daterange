document.addEventListener('DOMContentLoaded', function(){
    daterange.Init();
});

var daterange = {
    Init: function()
    {
        document.querySelectorAll(".daterange").forEach(item => {
            this.Create(item);
        });
    },
    Create: function(elem)
    {
        let div = document.createElement('div');
        div.classList.add('daterange-input');
        elem.value = this.Parse(elem.value);
        div.innerHTML = "<p>" + elem.value + "</p>";
        elem.parentNode.insertBefore(div, elem.nextSibling);
        div.appendChild(elem);
        div.onclick = (e) => this.Open(div);
    },
    Open: function(div)
    {
        console.log("open");
    },
    Parse: function(str)
    {
        let date = this.Tools.getDateObject(str);
        let month = (date.getMonth()+1).toString().padStart(2, "0");
        let day = date.getDate().toString().padStart(2, "0");
        let year = date.getFullYear();
        return day + "." + month + "." + year;
    },
};

daterange.Tools = {
    getMonth: function(index)
    {
        let months = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
        index = (index != null && index >= 0 && index <= months.length) ? index : 0;
        return months[index];
    },
    getWeekDay: function(day)
    {
        let days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    },
    getDateObject: function(str)
    {
        let date = new Date();
        str = (!str) ? [] : str.split(".");
        if (str[2]) date = new Date(parseInt(str[2].toString().padStart(4, "20")), parseInt(str[1])-1, parseInt(str[0]));
        return date; 
    }
};