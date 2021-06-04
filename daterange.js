Date.prototype.daysInMonth = function () {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};
Date.prototype.startDay = function () {
    return new Date(this.getFullYear(), this.getMonth(), 1).getDay();
};
Date.prototype.getMonthName = function () {
    let months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
    return months[this.getMonth()];
};
Date.prototype.getWeekName = function () {
    let days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    return months[this.getDay];
};

document.addEventListener('DOMContentLoaded', function () {
    daterange.Init();
});

var daterange = {
    currentCalendar: null,
    pos: {
        x: 0,
        y: 0,
        scroll: 0,
        nav: 0
    },
    Init: function () {
        document.querySelectorAll(".daterange").forEach(item => {
            this.Create(item);
        });
    },
    Create: function (elem) {
        let div = document.createElement('div');
        div.classList.add('daterange-input');
        elem.value = this.Tools.dateToString(this.Tools.stringToDate(elem.value));
        div.innerHTML = "<p>" + elem.value + "</p>";
        elem.parentNode.insertBefore(div, elem.nextSibling);
        div.appendChild(elem);
        div.onclick = (e) => this.Open(div);
    },
    Open: function (div) {
        this.currentCalendar = div;
        let current = this.Tools.stringToDate(div.querySelector("input").value);
        let wrapper = document.createElement('div');
        let calendar = document.createElement('div');
        wrapper.classList.add("daterange-wrapper-full");
        calendar.classList.add("daterange-calendar");

        wrapper.appendChild(calendar);
        calendar.appendChild(this.CreateCalendar(this.Tools.prevMonth(current)));
        calendar.appendChild(this.CreateCalendar(current));
        calendar.appendChild(this.CreateCalendar(this.Tools.nextMonth(current)));

        document.body.appendChild(wrapper);

        calendar.ontouchstart = (e) => {
            this.pos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                scroll: calendar.scrollLeft,
                nav: 0
            };
        }
        calendar.ontouchend = (e) => {            
            this.pos.x = this.pos.y  = 0;
            calendar.style.scrollBehavior = 'smooth';
            let coof = Math.round(calendar.scrollLeft / calendar.clientWidth);
            let newScrollPosition = calendar.clientWidth * coof;
            calendar.scrollLeft = newScrollPosition;
            calendar.style.scrollBehavior = 'auto';
            
            let animationInterval = setInterval(() => {
                if (newScrollPosition === calendar.scrollLeft) {
                    window.clearInterval(animationInterval);
                    if ((coof == 0 && this.nav < 0) || (coof == 2 && this.nav > 0)) {
                        let calendarList = wrapper.querySelectorAll("table");
                        let removeTable = (this.nav < 0) ? calendarList[0] : calendarList[calendarList.length - 1];
                        let oldDate = removeTable.getAttribute("data-current");
                        calendar.innerHTML = "";
                        calendar.appendChild(this.CreateCalendar(this.Tools.prevMonth(this.Tools.stringToDate(oldDate))));
                        calendar.appendChild(this.CreateCalendar(this.Tools.stringToDate(oldDate)));
                        calendar.appendChild(this.CreateCalendar(this.Tools.nextMonth(this.Tools.stringToDate(oldDate))));
                        calendar.scrollLeft = calendar.clientWidth;
                    }
                }
            }, 100);

           
            
        }
        calendar.ontouchmove = (e) => {
            let offset = (this.pos.x >= e.touches[0].clientX) ? this.pos.x - e.touches[0].clientX : e.touches[0].clientX - this.pos.x;
            if (this.pos.x >= e.touches[0].clientX) {
                calendar.scrollLeft = this.pos.scroll + offset;
                this.nav = 1;
            } else {
                calendar.scrollLeft = this.pos.scroll - offset;
                this.nav = -1;
            }
        }
        calendar.scrollLeft = calendar.clientWidth;
        wrapper.onclick = (e) => {
            if (e.target.classList.contains("daterange-wrapper-full")) this.Close();
        }
    },
    Close: function () {
        document.querySelectorAll(".daterange-wrapper-full").forEach(item => item.remove());
    },
    CreateCalendar: function (date) {
        let daysInMonth = date.daysInMonth();
        let startDay = date.startDay();
        startDay = (startDay > 0) ? startDay : 7;
        let table = document.createElement('table');
        table.setAttribute("data-current", this.Tools.dateToString(date));
        let tbody = document.createElement('tbody');
        let tr = document.createElement('tr');
        let day = 1;
        for (let index = 1; index <= 42; index++) {
            let classList = (index >= startDay && day <= daysInMonth) ? [] : ["daterange-empty"];
            tr.appendChild(this.Tools.createColumn((index >= startDay && day <= daysInMonth) ? day++ : "&nbsp;", classList));
            if (this.Tools.isInteger(index / 7)) {
                tbody.appendChild(tr);
                tr = document.createElement('tr');
            }
        }
        let thead = this.Tools.getThead(date);
        table.appendChild(thead);
        
        table.appendChild(tbody);
        tbody.onclick = (e) => {
            if (!e.target.classList.contains("daterange-empty")) {
                let now = this.Tools.chooseDate(e.target.innerHTML, date);
                this.currentCalendar.querySelector("p").innerHTML = now;
            }
        }

        return table;
    },
};

daterange.Tools = {
    getMonth: function (index) {
        let months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
        index = (index != null && index >= 0 && index <= months.length) ? index : 0;
        return months[index];
    },
    getDateObject: function (str) {
        let date = new Date();
        str = (!str) ? [] : str.split(".");
        if (str[2]) date = new Date(parseInt(str[2].toString().padStart(4, "20")), parseInt(str[1]) - 1, parseInt(str[0]));
        return date;
    },
    isInteger: function (num) {
        return (num ^ 0) === num;
    },
    getThead: function (date) {
        let days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
        let thead = document.createElement('thead');
        let tr = document.createElement('tr');
        tr.appendChild(this.createColumn("<span>" + date.getMonthName() + "</span><strong>" + date.getFullYear() + "</strong>", ["daterange-title"], {
            colspan: 7
        }));
        thead.appendChild(tr);
        tr = document.createElement('tr');
        days.forEach(item => tr.appendChild(this.createColumn(item)));
        thead.appendChild(tr);
        return thead;
    },
    createColumn: function (str, classList, attribute) {
        if (!classList) classList = [];
        if (!attribute) attribute = {};
        let column = document.createElement('td');
        for (key in attribute) column.setAttribute(key, attribute[key]);
        classList.forEach(item => column.classList.add(item));
        column.innerHTML = str;
        return column;
    },
    dateToString: function (date) {
        let month = (date.getMonth() + 1).toString().padStart(2, "0");
        let day = date.getDate().toString().padStart(2, "0");
        let year = date.getFullYear();
        return day + "." + month + "." + year;
    },
    stringToDate: function (str) {
        let date = new Date();
        str = (!str) ? [] : str.split(".");
        if (str[2]) date = new Date(parseInt(str[2].toString().padStart(4, "20")), parseInt(str[1]) - 1, parseInt(str[0]));
        return date;
    },
    nextMonth: function (current) {
        let month = current.getMonth() + 1;
        let year = current.getFullYear();
        if (month > 11) {
            month = 0;
            year += 1;
        }
        let newDate = new Date(year, month, 1);
        return newDate;
    },
    prevMonth: function (current) {
        let month = current.getMonth() - 1;
        let year = current.getFullYear();
        if (month < 0) {
            month = 11;
            year -= 1;
        }
        let newDate = new Date(year, month, 1);
        return newDate;
    },
    chooseDate: function(day, date) {
        let now = this.dateToString(date).split(".");
        now[0] = day.toString().padStart(2, "0");
        return now.join('.');
    }
};