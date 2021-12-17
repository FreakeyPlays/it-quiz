window.addEventListener("load", function(){ quizObj.init() })

const quizObj = {
    url: "https://www2.hs-esslingen.de/~melcher/internet-technologien/quiz/",
    init(){
        body = document.body;
        const page = this.makePage();
        body.appendChild(page);
        
        this.showStatePage("Not logged in");
    },

    pageLoginSend(usrId, usrPwd){
        this.showStatePage("Logging in...");
        try {
            fetch(this.url + `?request=login&userid=${usrId}&password=${usrPwd}`)
            .then(response => response.json())
            .then(data => {
                if(data.status == "error"){
                    this.showStatePage("Wrong input");
                }else{
                    this.showStatePage("Select Theme");
                }
            });
        } catch (error) {
            this.showStatePage("Wrong input")
        }
    },

    showStatePage(state){
        switch (state) {
            case "Not logged in":
                    this.pageLogin();
                break;
            case "Logging in...":
                    this.pageWait("Logging in...");
                break;
            case "Wrong input":
                    this.pageLogin("Wrong Username or Password!");
                break;
            case "Select Theme":
                    this.pageTheme();
                break;
            default:
                    alert("This should not happen.\nError: " + state);
                break;
        }
    },

    showPages(){
        const pages = [this.pageLogin, this.pageWait, this.pageTheme, this.pageWait, this.pageQuiz, this.pageWait, this.pageResult, this.pageWait, this.pageSummary, this.pageWait];
        var pageIndex = 0;
        setInterval(() =>{
            pages[pageIndex].call(this);
            pageIndex++;
            if(pageIndex >= pages.length)
                pageIndex = 0;
        }, 2000);
    },

    // Basic HTML

    makePage(){
        const divPage = document.createElement("div");
        divPage.classList.add("page");

        const header = this.makeHeader();
        divPage.appendChild(header);

        const main = this.makeMain();
        divPage.appendChild(main);

        const footer = this.makeFooter();
        divPage.appendChild(footer);

        return divPage;
    },

    makeHeader(){
        const divHeader = this.createElement("div", "pagecontainer header");
        const header = this.createElement("HEADER");

        const h1 = this.createElement("H1");
        const span = this.createElement("span");
        span.innerHTML = "Q";
        h1.appendChild(span);
        h1.innerHTML = h1.innerHTML + "uiz";
        header.appendChild(h1);

        const p = this.createElement("p");
        p.innerHTML = "by Christoph Merck";
        header.appendChild(p);

        divHeader.appendChild(header);

        return divHeader;
    },

    makeMain(){
        const divMain = this.createElement("div", "pagecontainer main");
        const main = this.createElement("MAIN", "content");
        divMain.appendChild(main);

        return divMain;
    },

    makeFooter(){
        const divFooter = this.createElement("div", "pagecontainer footer");
        const footer = this.createElement("FOOTER");

        footer.innerHTML = "&copy; 2021 by Christoph Merck";

        divFooter.appendChild(footer);

        return divFooter;
    },

    // Pages

    pageLogin(message){
        const content = this.getEmptyContent();
        const loginfield = this.contentLogin(message);

        content.appendChild(loginfield);
    },

    pageWait(message){
        const content = this.getEmptyContent();
        const wait = this.contentWait(message);

        content.appendChild(wait);
    },

    pageTheme(){
        const content = this.getEmptyContent();
        this.addChapterBar();
        const select = this.contentChapterSelect();

        content.appendChild(select);
    },

    pageQuiz(){
        const content = this.getEmptyContent();
        const quiz = this.contentQuiz();

        content.appendChild(quiz);
    },

    pageResult(){
        const content = this.getEmptyContent();
        this.addResultBar();
        const result = this.contentResult();

        content.appendChild(result);
    },

    pageSummary(){
        const content = this.getEmptyContent();
        const summary = this.contentSummary();

        content.appendChild(summary);
    },

    // Login

    contentLogin(message){
        const loginfield = this.createElement("div", "logInBox");

        const h2 = this.createElement("H2");
        h2.innerHTML = "Login";
        loginfield.appendChild(h2);

        const form = this.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", "");

        const inputName = this.makeInputField("text", "username", "usernameInput", "Username (>5 chars)", true, 5);
        form.appendChild(inputName);

        const br1 = this.createElement("br");
        form.appendChild(br1);

        const inputPassword = this.makeInputField("password", "password", "passwordInput", "Password (>5 chars)", true, 5);
        form.appendChild(inputPassword);

        const br2 = this.createElement("br");
        form.appendChild(br2);

        if(message){
            const err = this.createElement("div", "loginErr");
            err.innerHTML = message;
            form.appendChild(err);
            const br3 = this.createElement("br");
            form.appendChild(br3);
        }

        const submitBtn = this.createElement("button", "logInBtn");
        submitBtn.setAttribute("type", "submit");
        submitBtn.setAttribute("name", "submit");
        submitBtn.innerHTML = "Login";
        submitBtn.setAttribute("disabled", true);
        form.appendChild(submitBtn);

        loginfield.appendChild(form);

        const buttonEnabler = () =>{
            submitBtn.disabled = !inputName.reportValidity() || !inputPassword.reportValidity();
        }

        inputName.addEventListener("input", buttonEnabler);
        inputPassword.addEventListener("input", buttonEnabler);

        submitBtn.addEventListener("click", () => {
            this.pageLoginSend(inputName.value, inputPassword.value);
        });    

        return loginfield;
    },

    // Wait

    contentWait(message){
        const waitScreen = this.createElement("div", "loadingBoxTop");
        const loadingBoxBottom = this.createElement("div", "loadingBoxBottom");
        const loadingBoxCircle = this.createElement("div", "loadingBoxCircle");

        const loadingScreenText = this.createElement("div", "loadingScreenText");
        const text = this.createElement("H2", "loadingMessage");    // Eventuell ID anstatt Class
        if(message == undefined)
            text.innerHTML = "Loading...";
        else
            text.innerHTML = message;

        loadingScreenText.appendChild(text);

        loadingBoxBottom.appendChild(loadingBoxCircle);
        loadingBoxBottom.appendChild(loadingScreenText);
        waitScreen.appendChild(loadingBoxBottom);

        return waitScreen;
    },

    // Chapter Select

    addChapterBar(){
        const page = document.getElementsByClassName("page")[0];
        const main = document.getElementsByClassName("main")[0];
        
        const selectBar = this.createElement("div", "selectBar");
        selectBar.appendChild( this.makeSelect("selectTheme", "Theme", [{value: "java", name: "Java"}, {value: "it", name: "Internet-Technology"}]) );
        selectBar.appendChild( this.makeSelect("selectChapter", "Chapter", [{value: "it-basics", name: "Basics"}, {value: "it-html", name: "HTML"}, {value: "it-css", name: "CSS"}]) );

        page.insertBefore(selectBar, main)
    },

    removeChapterBar(){
        const element = document.getElementsByClassName("selectBar")[0];

        if(element != null)
            element.remove();
    },

    contentChapterSelect(){
        const message = this.createElement("div", "actionMessage");
        message.innerHTML = "Please select a Theme and Chapter"

        return message;
    },

    // Quiz

    contentQuiz(){
        const box = this.createElement("div", "questionBox");

        box.appendChild(this.makeTitle("H2", "Request"));
        box.appendChild(this.createElement("br"));
        box.appendChild(this.makeTitle("H3", "What transport ptotocoll does HTTP use?"));
        box.appendChild(this.createElement("br"));
        
        var answerList = ["UDP", "TDP", "HTML", "FDP"];
        answerList.forEach(e => box.appendChild(this.makeQuestion(e)));

        const button = this.makeButton("Submit", "submitBtn", [{name: "type", value: "submit"}, {name: "name", value: "submit"}]);

        box.appendChild(button);

        return box;
    },

    // Result

    addResultBar(){
        const page = document.getElementsByClassName("page")[0];
        const footer = document.getElementsByClassName("footer")[0];
        
        const resultBar = this.createElement("div", "pagecontainer resultControl");
        resultBar.appendChild( this.makeButton("Repeat", "resultButton", [{name: "type", value: "submit"}, {name: "name", value: "repeat"}]) );
        resultBar.appendChild( this.makeButton("Next", "resultButton", [{name: "type", value: "submit"}, {name: "name", value: "next"}]) );

        page.insertBefore(resultBar, footer)
    },

    removeResultBar(){
        const element = document.getElementsByClassName("resultControl")[0];
        
        if(element != null)
            element.remove();
    },

    contentResult(){
        const box = this.createElement("div", "resultBoxTop");
        const boxBottom = this.createElement("div", "resultBoxBottom");
        const boxContent = this.createElement("div", "resultBoxContent resultRight");

        boxBottom.appendChild(boxContent);
        box.appendChild(boxBottom);

        return box;
    },

    // Summary

    contentSummary(){
        const box = this.createElement("div", "area");
        const top = this.createElement("div", "summaryBoxTop");
        const bottom = this.createElement("div", "summaryBoxBottom");
        const area = this.createElement("div", "summaryBoxContent summaryArea");
        const pie = this.createElement("div", "summaryPie");
        const left = this.createElement("div", "summaryLabelLeft");
        left.innerHTML = "75% passed";
        const right = this.createElement("div", "summaryLabelRight");
        right.innerHTML = "25% failed";

        pie.appendChild(left);
        pie.appendChild(right);

        area.appendChild(pie);
        bottom.appendChild(area);
        top.appendChild(bottom);

        box.appendChild(top);

        const topic = this.createElement("div", "summaryTopic");
        topic.innerHTML = "Internet-Technology";
        const chapter = this.createElement("div", "summaryChapter");
        chapter.innerHTML = "Basics";

        box.appendChild(topic);
        box.appendChild(chapter);

        return box;
    },

    // Create Elements

    makeButton(message, classNames, attributes){
        const button = this.createElement("button");
        button.innerHTML = message;

        if(classNames != null){
            classList = classNames.split(" ");
            classList.forEach(className => {
                button.classList.add(className);
            });
        }

        attributes.forEach(e => button.setAttribute(e.name, e.value))

        return button;
    },

    makeQuestion(text){
        const div = this.createElement("div", "quizAnswers");
        const chkBox = this.createElement("input");
        chkBox.setAttribute("type", "checkbox");
        div.appendChild(chkBox);
        div.innerHTML += text;

        return div;
    },

    makeTitle(type, message, classNames){
        const title = this.createElement(type);
        title.innerHTML = message;

        if(classNames != null){
            classList = classNames.split(" ");
            classList.forEach(className => {
                title.classList.add(className);
            });
        }

        return title;
    },

    makeSelect(id, title, list){
        const select = this.createElement("select");
        select.id = id;
        const titleOption = this.createElement("option");
        titleOption.innerHTML = title;
        titleOption.setAttribute("value", "");
        titleOption.setAttribute("disabled", "");
        titleOption.setAttribute("selected", "");
        select.appendChild(titleOption);

        for (let i = 0; i < list.length; i++) {
            const option = this.createElement("option");
            option.innerHTML = list[i].name;
            option.setAttribute("value", list[i].value);

            select.appendChild(option);
        }

        return select;
    },

    makeInputField(type, name, className, placeholder, required, minlen){
        const input = this.createElement("input", className);
        input.setAttribute("type", type);
        input.setAttribute("name", name);
        input.setAttribute("placeholder", placeholder);
        input.setAttribute("minlength", minlen)
        input.required = required;

        return input;
    },

    getEmptyContent(){
        const content = document.getElementsByClassName("content")[0];
        content.innerHTML = "";

        this.removeChapterBar();
        this.removeResultBar();

        return content;
    },

    createElement(tag, classNames){
        const element = document.createElement(tag);
        if(classNames != null){
            classList = classNames.split(" ");
            classList.forEach(className => {
                element.classList.add(className);
            });
        }

        return element;
    }
};