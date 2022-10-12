//즉시 호출, 전역변수 사용자제
//(()=>{})();
(() => {
    //전체 문서에서의 현재 스크롤 높이
    let yOffset = 0;
    //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 높이값의 합
    let prevScrollHeight = 0;
    //현재 눈앞에 보이는 구간(scroll-section)
    let currentScene = 0;

    const sceneInfo = [
        {   //0구간
            type: 'sticky',
            //브라우저 높이의 5배로 scrollHeight설정
            heightNum:5,
            //에니메이션 구간 설정
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
            //어떤 디바이스로 보든 창 높이의 5배로 설정 4795
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].obj.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        // console.log("window.innerHeight",window.innerHeight); //959
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for(let i=0; i< sceneInfo.length; i++){
            totalScrollHeight +=sceneInfo[i].scrollHeight;
            //한 섹션구간이 지나가면다음 섹션
            if(totalScrollHeight >= yOffset){ 
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id',`show-scene-${currentScene}`);
    }

    function calcValues(values, currentYOffset){ //변화의 시작과 끝
        let rv;
        //현재 섹션에서 얼마큼 스크롤을 했는지
        //현재 섹션전체 범위 / 현재 얼만큼 스크롤했는지
        let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;

        rv = parseInt(scrollRatio * 300);
        return rv;
    }

    function playAnimation() {
        const values = sceneInfo[currentScene].values;
        const obj = sceneInfo[currentScene].obj;
        const currentYOffset = yOffset - prevScrollHeight;

        switch(currentScene){
            case 0:
                // console.log('0 play');
                let messageA_opacity_0 = values.messageA_opacity[0];
                let messageA_opacity_1 = values.messageA_opacity[1];
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
        // console.log("sceneInfo[currentScene].scrollHeight",sceneInfo[currentScene].scrollHeight);
        
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){//4795
            currentScene++;
            //섹션 변경이 일어날 때
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        
        if(yOffset < prevScrollHeight){
            console.log("prevScrollHeight",prevScrollHeight);
            //바운스 효과로 마이너스 되는 것 방지
            if(currentScene === 0) return;
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        // console.log("currentScene",currentScene);
        //body에 id지정
        playAnimation();
    }
    
    //스크롤 시 작동
    window.addEventListener('scroll',()=> {
        yOffset = window.pageYOffset;
        // console.log("yOffset",window.pageYOffset);
        scrollLoop();
    });

    window.addEventListener('load',setLayout);
    //창크기를 줄였을 때 사이즈 재설정
    window.addEventListener('resize',setLayout);

    setLayout();
})();