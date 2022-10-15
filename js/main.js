//즉시 호출, 전역변수 사용자제
//(()=>{})();
(() => {
    let yOffset = 0; //window.pageYOffset 현재 스크롤 높이
    let prevScrollHeight = 0; //이전 섹션높이
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)

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
                messageA_opacity: [0, 1]
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
        let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;

        rv = scrollRatio * (values[1] - values[0]) + values[0];
        
        return rv;
    }
0
    function playAnimation() {
        const obj = sceneInfo[currentScene].obj;
        const values = sceneInfo[currentScene].values;
        //현재섹션에서의 높이
        const currentYOffset = yOffset - prevScrollHeight;

        switch(currentScene){
            case 0:
                let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset);
                obj.messageA.style.opacity = messageA_opacity_in;
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
        prevScrollHeight = 0;
        for(let i=0; i< currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        
        //섹션높이 합보다 현재 스크롤높이가 크다면
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            currentScene++;
            //섹션 변경이 일어날 때
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        
        if(yOffset < prevScrollHeight){
            //바운스 효과로 마이너스 되는 것 방지
            if(currentScene === 0) return;
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
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