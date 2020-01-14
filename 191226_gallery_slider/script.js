/*jshint esversion: 6*/

/************
  생성자 함수들
************/
//버튼 클릭 생성자 함수
function ClickButtons(name) {
  this.name = name;
}
ClickButtons.prototype.click = function(callback) {
  this.name.forEach(el => {
    el.addEventListener("click", ()=>{
      callback(el);
    });
  });    
};

/************
  미니 함수들
************/
// 클래스명 추가
function addClass(el, className){
  el.className += " " + className;
}
// 클래스명 제거
function removeClass(el, className){
  el.className = el.className.replace(" " + className,"");
}
// 클래스값 가지고 있는지 체크
function hasClass(el, className){
  let arr = el.className.split(" ");
  if(arr.indexOf(className) > -1){
    return true;
  }else{
    return false;
  }
}
// 속성값 가지고 있는 엘리먼트
function getElByAttr(els, attrName, attrValue){
  let that;
  els.forEach(el => {
    if(el.attributes[attrName].value === attrValue){
      that = el;
    }
  });
  return that;
}

/************
  재료들로 DOM 콘츄롤 
************/
// EVENT! 토글 버튼 클릭 시
const togLayerBtns = document.querySelectorAll("[data-role*='layertoggle']"),
      togLayerBtn = new ClickButtons(togLayerBtns),
      togLayers = document.querySelectorAll("[data-role*='layertarget']");

togLayerBtn.click((el)=>{
  let i = el.dataset.index,
      thisLayer = getElByAttr(togLayers, "data-index", i);
  if(hasClass(thisLayer, "open")){
    removeClass(thisLayer, "open");
  }else{
    addClass(thisLayer, "open");
  }
});
// EVENT! 슬라이더



// START: 슬라이더
// 페이저, 컨트롤러, 루프, 프랙션, 오토
(function startSlider(){
  const dataSliders = document.querySelectorAll("[data-slider]");
  // 롤링 텍스트 json 배열 생성
  // 해당 엘리먼트 오브젝트 포함하여 배열 생성

  let sliderWraps = [],
      i = 0;
  for (const dataSlider of dataSliders) {
    sliderWraps[i] = {},
      sliderWraps[i].el = dataSlider;
    i++;
  }

  sliderWraps.forEach(slider => {
    slider.type = slider.el.dataset.slider;
    slider.slider = slider.el.querySelector(".slider");
    slider.slides = slider.el.querySelectorAll(".slide");
    slider.activeNum = 0;
    slider.loop = true;
  });

  sliderWraps.forEach(sliderWrap => {    
    const view = sliderWrap.el.querySelector(".view-slider"),
          slider = sliderWrap.slider,
          slides = sliderWrap.slides,
          btnArrows = sliderWrap.el.parentNode.querySelectorAll(".arrow button");
    let _activeNum = sliderWrap.activeNum;
    setDataPrevNext(slides, _activeNum);

    //슬라이더 가로 사이즈 셋팅
    slider.style = "width: "+view.offsetWidth * slides.length + "px; transform: translateX(-"+ view.offsetWidth +"px); transition: 0.5s ease;";
    
    // loop일경우 처음과 끝 이어지게
    if(sliderWrap.loop){
      let clonePrev = slides[slides.length-1].cloneNode(true),
          cloneNext = slides[0].cloneNode(true);
      clonePrev.className += " clone";
      cloneNext.className += " clone";
      clonePrev.dataset.slide = "clone";
      cloneNext.dataset.slide = "clone";

      slider.insertBefore(cloneNext, slider.children[slides.length - 1].nextElementSibling);
      slider.insertBefore(clonePrev, slider.children[0]);      
    }

    // 이전 다음 버튼 클릭 했을 때
    btnArrows.forEach((btnArrow) => {
      btnArrow.addEventListener("click", (e) => {
        const btnData = btnArrow.dataset.btn;
        let activeNum = newActiveNum(btnData, slides.length - 1, _activeNum);
        _activeNum = activeNum;  //클릭한 버튼에 따라 active 슬라이드 index값 변환
        
        resetDataset(slides, "slide"); //슬라이드 dataset 초기화 
        setDataPrevNext(slides, _activeNum); //active 슬라이드 셋팅
        slider.style.transform = "translateX(-"+ view.offsetWidth * (_activeNum+1) +"px)"; //슬라이더 슬라이딩
      });
    });
  });
})();
// END: 슬라이더

// prev, next 클릭시 변하는 active 넘버 반환
function newActiveNum(data, last, activeNum){
  if(activeNum == last && data == "next"){
    activeNum = 0;
  }else if (activeNum == 0 && data == "prev"){
    activeNum = last;
  }else if(data == "next"){
    activeNum = activeNum + 1;
  }else if(data == "prev"){
    activeNum = activeNum - 1;
  }
  return activeNum;
}

// active 넘버에 따라 slide dataset 셋팅.
function setDataPrevNext(slides, _activeNum){
  const activePrevNum = _activeNum != 0 ? _activeNum - 1 : slides.length - 1,
        activeNextNum = _activeNum != slides.length - 1 ? _activeNum + 1 : 0;

  slides[_activeNum].dataset.slide = "active";
  slides[activePrevNum].dataset.slide = "prev";
  slides[activeNextNum].dataset.slide = "next";
}

// dataset 초기화
function resetDataset(elems, datasetName){
  for(const elem of elems){
    elem.dataset[datasetName] = "";
  }
}




// 숫자라면 true를 줘
function chkNum(value) {
  if (Number(value)) {
    return true
  } else if (isNaN(Number(value))) {
    return false;
  }
}

// 스크롤 범위 맞으면 true를 줘
function chkScrRange(list) {
  let winH = window.innerHeight,
    winScrY = window.scrollY,
    bodyScrH = document.querySelector("body").scrollHeight,
    elemScrTop = list.el.offsetTop;
  
  if (elemScrTop - winH / 2 < winScrY && winScrY < elemScrTop - 20) {
    // 스크롤이 엘리먼트 범위에 들어올 때(엘리먼트 스크롤높이 기준 상하로 winH/2 범위)
    return true;
  } else if (bodyScrH - winH / 2 < elemScrTop && bodyScrH - 20 <= winScrY + winH) {
    // 엘리먼트가 하단에 붙어있을 때(엘리먼트 위치가 바디 스크롤 하단 영역인지 구분 & 스크롤이 하단영역으로 왔는지 구분)
    return true;
  } else {
    return false;
  }
}

// 조건 체크 후 텍스트 롤링
function fireRolling(text) {
  const commonIf = !text.done && chkScrRange(text);
  if (chkNum(text.cont) && commonIf) {
    drawNumber(text.el, 0, text.cont);
    text.done = true;
  } else if (!chkNum(text.cont) && commonIf) {
    drawNaN(text.el, text.cont, 0);
    showNaN(text.el, text.cont, 0);
    text.done = true;
  }
}

// 숫자 카운팅 하면서 그려 ( Number )
function drawNumber(elem, start, limitNum) {
  if (start <= limitNum) {
    setTimeout(() => {
      elem.textContent = start;
      start++;
      drawNumber(elem, start, limitNum);
    }, 1500 / limitNum);
  }
}

// 한 글자씩 셋팅 ( NaN )
function drawNaN(elem, text, start) {
  if (start < text.length) {
    elem.innerHTML += `<span style="opacity:0;">${text.substring(start,start+1)}</span>`;
    start++;
    drawNaN(elem, text, start);
  }
}

// 한 글자씩 show ( NaN )
function showNaN(elem, text, start) {
  if (start < text.length) {
    setTimeout(() => {
      elem.querySelectorAll("span")[start].style = "opacity: 1";
      start++;
      showNaN(elem, text, start);
    }, 800 / text.length);
  }
}
