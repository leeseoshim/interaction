//즉시 호출, 전역변수 사용자제
//(()=>{})();
(() => {
    let yOffset = 0; //window.pageYOffset 현재 스크롤 높이
    let prevScrollHeight = 0; //이전 섹션높이
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; //새로운 scene이 시작되는순간 true

    const sceneInfo = [
        {   //0구간
            type: 'sticky',
            heightNum:5, //브라우저 높이의 5배로 scrollHeight설정
            scrollHeight:0,
            obj: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d')
            },
            values: {
                messageA_opacity_in: [0, 1, {start:0.1, end: 0.2}],
                messageA_translateY_in: [20, 0, {start:0.1, end: 0.2}],
                messageA_opacity_out: [1, 0, {start:0.25, end: 0.3}],
                messageA_translateY_out: [0, -20, {start:0.25, end: 0.3}],
            }
        },
        {   //1구간
            type: 'normal',
            heightNum:5,
            scrollHeight:0,
            obj: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {   //2구간
            type: 'sticky',
            heightNum:5,
            scrollHeight:0,
            obj: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {   //3구간
            type: 'sticky',
            heightNum:5,
            scrollHeight:0,
            obj: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];

    function setLayout() {
        //각 스크롤 섹션의 높이 세팅
        for(let i=0; i< sceneInfo.length; i++){
            //섹션높이 4795
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].obj.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for(let i=0; i< sceneInfo.length; i++){
            //섹션 높이의 합
            totalScrollHeight +=sceneInfo[i].scrollHeight;
            //다음섹션으로 넘어갔을 때
            if(totalScrollHeight >= yOffset){ 
                currentScene = i;
                break;
            }
        }
        //body에 아이디 삽입해서 섹션이 변할 때 마다 변경
        document.body.setAttribute('id',`show-scene-${currentScene}`);
    }

    function calcValues(values, currentYOffset){
        let rv;
        // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            //start ~ end 사이에 애니메이션실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;
            
            //에니메이션 구간 안에 들어왔을때
            if(currentYOffset >= partScrollStart && currentScene <= partScrollEnd){
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if(currentYOffset < partScrollStart) {
                rv = values[0];
            } else if(currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        
        return rv;
    }

    function playAnimation() {
        const obj = sceneInfo[currentScene].obj;
        const values = sceneInfo[currentScene].values;
        //현재섹션에서의 높이
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = (yOffset - prevScrollHeight) / scrollHeight;

        switch(currentScene){
            case 0:
                let messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
                let messageA_translateY_in = calcValues(values.messageA_translateY_in, currentYOffset);
                let messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);
                let messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset);
                
                if(scrollRatio <= 0.22) {
                    //in
                    obj.messageA.style.opacity = messageA_opacity_in;
                    obj.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
                } else {
                    //out
                    obj.messageA.style.opacity = messageA_opacity_out;
                    obj.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
                }
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }
        
    function scrollLoop(){
        enterNewScene = false;
        prevScrollHeight = 0;
        for(let i=0; i< currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        
        //섹션높이 합보다 현재 스크롤높이가 크다면
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            enterNewScene = true;
            currentScene++;
            //섹션 변경이 일어날 때
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        
        if(yOffset < prevScrollHeight){
            enterNewScene = true;
            //바운스 효과로 마이너스 되는 것 방지
            if(currentScene === 0) return;
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        if(enterNewScene) return;

        playAnimation();
        
    }
    
    //스크롤 시 작동
    window.addEventListener('scroll',()=> {
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    //재설정
    window.addEventListener('load',setLayout);
    window.addEventListener('resize',setLayout);

    setLayout();
})();