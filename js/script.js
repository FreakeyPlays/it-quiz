window.addEventListener("load", function(){ quizObj.init() })

const quizObj = {
    url: "https://www2.hs-esslingen.de/~melcher/internet-technologien/quiz/",
    token: null,
    themes: [],
    chapters: [],
    choosenTheme: null,
    themeName: null,
    choosenChapter: null,
    chapterName: null,
    quiz: null,
    selectedAnswers: null,
    passed: null,
    
    init(){
        const body = document.body;
        const page = this.makePage();
        body.appendChild(page);
        
        this.showStatePage("Not logged in");
    },

    showStatePage(state){
        switch (state) {
            case "Not logged in":
                this.pageLogin();
                break;
            case "Logging in":
                this.pageWait("Logging in...");
                break;
            case "Wrong input":
                this.pageLogin("Wrong Username or Password!");
                break;
            case "Select Theme":
                this.pageTheme("Choose a Theme");
                break;
            case "Loading Themes":
                this.pageWait("Loading Themes...");
                break;
            case "Network Error":
                this.pageWait("Network Error \n Please reload!");
                break;
            case "Loading Chapters":
                this.pageWait("Loading Chapters...");
                break;
            case "Select Chapter":
                this.pageTheme("Choose a Chapter");
                break;
            case "Loading Quiz":
                this.pageWait("Loading Quiz...");
                break;
            case "Load Question":
                this.pageWait("Load next Question...");
                break;
            case "Show Question":
                this.pageQuiz();
                break;
            case "Repeat Question":
                this.pageWait("Repeat Question...");
                break;
            case "Loading Answer":
                this.pageWait("Loading Answer...");
                break;
            case "Correct Answer":
                this.pageResult("resultRight", "disabled");
                break;
            case "Wrong Answer":
                this.pageResult("resultWrong");
                break;
            case "Loading Summary":
                this.pageWait("Loading Summary...");
                break;
            case "Show Summary":
                this.pageSummary();
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

    pageTheme(message){
        const content = this.getEmptyContent();
        this.addChapterBar();
        const select = this.contentChapterSelect(message);

        content.appendChild(select);
    },

    pageQuiz(){
        const content = this.getEmptyContent();
        const quiz = this.contentQuiz();

        content.appendChild(quiz);
    },

    pageResult(decision, option){
        const content = this.getEmptyContent();
        this.addResultBar(option);
        const result = this.contentResult(decision);

        content.appendChild(result);
    },

    pageSummary(){
        const content = this.getEmptyContent();
        this.addReplayBar();
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

        const submitBtn =  this.makeButton("Login", "logInBtn", [{name: "type", value: "button"}, {name: "name", value: "submit"}, {name: "disabled", value: true}]);
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
        const text = this.createElement("H2", "loadingMessage");
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
        const themeSelect = this.makeSelect("selectTheme", "Theme", this.themes);
        themeSelect.addEventListener("change", e => this.onThemeSelect(e));
        selectBar.appendChild( themeSelect );
        const chapterSelect = this.makeSelect("selectChapter", "Chapter", this.chapters);
        chapterSelect.addEventListener("change", e => this.onChapterSelect(e));
        selectBar.appendChild( chapterSelect );

        page.insertBefore(selectBar, main);
    },

    onThemeSelect(e){
        this.choosenTheme = e.srcElement.value;
        this.themeName = e.srcElement.options[e.target.selectedIndex].innerHTML;
        
        this.showStatePage("Loading Chapters");

        this.fetchAndDecode(`request=gettheme&theme=${this.choosenTheme}&token=${this.token}`)
            .then(data => {
                this.chapters = data.chapters;
                this.showStatePage("Select Chapter");
            }).catch(err => this.showStatePage("Network Error"));
    },

    onChapterSelect(e){
        this.choosenChapter = e.srcElement.value;
        this.chapterName = e.srcElement.options[e.target.selectedIndex].innerHTML;

        this.showStatePage("Loading Quiz");

        this.fetchAndDecode(`request=getquiz&theme=${this.choosenTheme}&chapter=${this.choosenChapter}&token=${this.token}`)
            .then(data => {
                this.quiz = data.quiz;
                this.showStatePage("Show Question");
            }).catch(err => this.showStatePage("Network Error"));
    },

    removeChapterBar(){
        const element = document.getElementsByClassName("selectBar")[0];

        if(element != null)
            element.remove();
    },

    contentChapterSelect(msg){
        const message = this.createElement("div", "actionMessage");
        message.innerHTML = msg ? msg : "Please select Theme and Chapter";

        return message;
    },

    // Quiz

    contentQuiz(){
        const box = this.createElement("div", "questionBox");

        box.appendChild(this.makeTitle("H2", this.quiz.title));
        box.appendChild(this.createElement("br"));
        box.appendChild(this.makeTitle("H3", this.quiz.question));
        box.appendChild(this.createElement("br"));
        
        const answers = this.createElement("div", "answerBox")
        var answerList = this.quiz.answers;
        answerList.forEach(ans => answers.appendChild(this.makeAnswer(ans)));
        box.appendChild(answers);

        const button = this.makeButton("Submit", "submitBtn", [{name: "type", value: "submit"}, {name: "name", value: "submit"}]);
        button.addEventListener("click", e => this.onAnswerSubmit(e));

        box.appendChild(button);

        return box;
    },

    getSelectedAnswers(){
        const checkedAnswers = document.querySelectorAll("input[type=checkbox]:checked");
        this.selectedAnswers = Array.from(checkedAnswers).map(node => node.getAttribute("data-id")).join();
    },

    onAnswerSubmit(e){
        this.getSelectedAnswers();

        this.showStatePage("Loading Answer");

        this.fetchAndDecode(`request=validateanswer&selected=${this.selectedAnswers}&token=${this.token}`)
            .then(data => {
                if(data.decision){
                    this.showStatePage("Correct Answer");
                }else{
                    this.showStatePage("Wrong Answer");
                }
            }).catch(err => this.showStatePage("Network Error"));
    },

    // Result

    addResultBar(option){
        const page = document.getElementsByClassName("page")[0];
        const footer = document.getElementsByClassName("footer")[0];
        
        const resultBar = this.createElement("div", "pagecontainer resultControl");

        const attributes = [{name: "type", value: "submit"}, {name: "name", value: "repeat"}];
        if(option){
            attributes.push({name: option, value: option})
        }

        const repeat = this.makeButton("Repeat", "resultButton", attributes);
        repeat.addEventListener("click", e => this.repeatQuestion(e));
        resultBar.appendChild( repeat );
        if(this.quiz.actual == this.quiz.total - 1){
            const summary = this.makeButton("Summary", "resultButton", [{name: "type", value: "submit"}, {name: "name", value: "summary"}]);
            summary.addEventListener("click", e => this.loadSummary(e));
            resultBar.appendChild( summary );
        }else{
            const next = this.makeButton("Next", "resultButton", [{name: "type", value: "submit"}, {name: "name", value: "next"}]);
            next.addEventListener("click", e => this.nextQuestion(e));
            resultBar.appendChild( next ); 
        }

        page.insertBefore(resultBar, footer)
    },

    loadSummary(e){
        this.showStatePage("Loading Summary");

        this.fetchAndDecode(`request=getsummary&token=${this.token}`)
            .then(data => {
                this.passed = parseInt((data.known / data.total) * 100)
                this.showStatePage("Show Summary")
            }).catch(err => this.showStatePage("Network Error"));
    },

    repeatQuestion(e){
        this.showStatePage("Repeat Question");

        this.fetchAndDecode(`request=getsamequiz&token=${this.token}`)
            .then(data => {
                this.quiz = data.quiz;
                this.showStatePage("Show Question")
            }).catch(err => this.showStatePage("Network Error"));
    },

    nextQuestion(e){
        this.showStatePage("Load Question");

        this.fetchAndDecode(`request=getnextquiz&token=${this.token}`)
            .then(data => {
                this.quiz = data.quiz;
                this.showStatePage("Show Question");
            });
    },

    removeResultBar(){
        const element = document.getElementsByClassName("resultControl")[0];
        
        if(element != null)
            element.remove();
    },

    contentResult(decision){
        const box = this.createElement("div", "resultBoxTop");
        const boxBottom = this.createElement("div", "resultBoxBottom");
        const boxContent = this.createElement("div", "resultBoxContent " + decision);

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
        left.innerHTML = `${this.passed}% passed`;
        const right = this.createElement("div", "summaryLabelRight");
        right.innerHTML = `${100 - this.passed}% failed`;

        pie.appendChild(left);
        pie.appendChild(right);

        area.appendChild(pie);
        area.style.backgroundImage = `conic-gradient(#f44336 ${360 - ((this.passed / 100) * 360)}deg, #43a047 0deg)`;
        bottom.appendChild(area);
        top.appendChild(bottom);

        box.appendChild(top);

        const topic = this.createElement("div", "summaryTopic");
        topic.innerHTML = this.themeName;
        const chapter = this.createElement("div", "summaryChapter");
        chapter.innerHTML = this.chapterName;

        box.appendChild(topic);
        box.appendChild(chapter);

        return box;
    },

    addReplayBar(){
        const page = document.getElementsByClassName("page")[0];
        const footer = document.getElementsByClassName("footer")[0];

        const replayBar = this.createElement("div", "pagecontainer replayBar");
        const replayBtn = this.makeButton("Replay", "replay-btn", [{name: "type", value: "submit"}, {name: "name", value: "replay"}]);
        replayBtn.addEventListener( "click", () => {
            this.loadThemes();
        } )
        replayBar.appendChild(replayBtn);

        page.insertBefore(replayBar, footer);
    },

    removeReplayBar(){
        const element = document.getElementsByClassName("replayBar")[0];
        
        if(element != null)
            element.remove();
    },

    // API Calls
    pageLoginSend(usrId, usrPwd){
        this.showStatePage("Logging in");
            this.fetchAndDecode(`request=login&userid=${usrId}&password=${usrPwd}`)
            .then(data => {
                if(data.status == "error"){
                    this.showStatePage("Wrong input");
                }else{
                    this.token = data.token;
                    this.loadThemes();
                }
            }).catch(err => this.showStatePage("Wrong input"));
    },

    loadThemes(){
        this.showStatePage("Loading Themes");

        this.fetchAndDecode(`request=getthemes&token=${this.token}`)
            .then(data => {
                this.themes = data.themes
                this.showStatePage("Select Theme")
            }).catch(err => this.showStatePage("Network Error"));
    },

    fetchAndDecode(requestStr){
        return fetch(this.url + "?" + requestStr)
            .then(response => response.json());
    },

    // Create Elements

    makeButton(message, classNames, attributes){
        const button = this.createElement("button", classNames);
        button.innerHTML = message;

        attributes.forEach(e => button.setAttribute(e.name, e.value))

        return button;
    },

    makeAnswer(answer){
        const div = this.createElement("div", "quizAnswers");
        const chkBox = this.createElement("input");
        chkBox.setAttribute("type", "checkbox");
        chkBox.setAttribute("data-id", answer.id)
        div.appendChild(chkBox);
        div.innerHTML += answer.text;

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
            option.setAttribute("value", list[i].id);

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
        this.removeReplayBar();

        return content;
    },

    createElement(tag, classNames){
        const element = document.createElement(tag);
        if(classNames != null){
            var classList = classNames.split(" ");
            classList.forEach(className => {
                element.classList.add(className);
            });
        }

        return element;
    }
};