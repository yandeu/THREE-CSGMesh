
class UI
{

}

function init(app){
    let {scene}=app;
    let w=window
    let opButtonEvt = new Event('opButton')
    let opButton=(e)=>{
        opButtonEvt.operation = e.target.innerText
        setTimeout(()=>document.dispatchEvent(opButtonEvt),0)
        
    }
    w.csgSubtract && (w.csgSubtract.onclick = opButton)
    w.csgUnion && (w.csgUnion.onclick = opButton)
    w.csgIntersect && (w.csgIntersect.onclick = opButton)

    let opAddButtonEvt = new Event('addButton')
    let addBtnClick =(e)=>{
        opAddButtonEvt.primType = e.target.innerText
        setTimeout(()=>document.dispatchEvent(opAddButtonEvt),0)
    }
    w.csgAddBox && (w.csgAddBox.onclick = addBtnClick)
    w.csgAddSphere && (w.csgAddSphere.onclick = addBtnClick)
    w.csgAddCylinder && (w.csgAddCylinder.onclick = addBtnClick)

    let cvclick = (e)=>e.target.style.height = ((e.target.style.height=="15px")?e.target.scrollHeight+"px":"15px")
    window.codeView&&(window.codeView.onclick = cvclick);
    document.addEventListener('cadRecomputed',(e)=>{
        if(window.codeView){
            window.codeView.innerText =  '[code]\n'+JSON.stringify(e.jsobj, undefined, 4);
            window.codeView.onclick = cvclick
        }
    })

    let selection
    let elements;
    document.addEventListener('selectionChanged',(e)=>{
        selection = e.app.selection
        elements = e.app.elements;
        if(selection.length){
            let fcad = selection[0].userData.node.fcad;
            let top=fcad.nodes.length-1;
            let topNode = fcad.nodes[top]
            if(window.elemIndexSlider){
                window.elemIndexSlider.min = 0;
                window.elemIndexSlider.max = top;
                let id = selection[0].userData.node.id;
                let val=0;
                topNode.args.forEach((e,i)=>(e.id==id)&&(val=i))
                window.elemIndexSlider.value = val;
            }
        }
    })
    if(window.elemIndexSlider)window.elemIndexSlider.oninput=(e)=>{
        if(selection && selection.length){
            let destId=parseInt(e.target.value)
            console.log(e.target.value)
            let fcad = selection[0].userData.node.fcad;
            let id = selection[0].userData.node.id;
            let curId=0;
            let top=fcad.nodes.length-1;
            let topNode = fcad.nodes[top]
            let tnodes = topNode.args;
            tnodes.forEach((e,i)=>(e.id==id)&&(curId=i))
            if((curId>=0)&&(curId<top)&&(destId>=0)&&(destId<top)&&(destId!=curId)){
               let swp = tnodes[curId]
               tnodes[curId] = tnodes[destId]
               tnodes[destId] = swp;
               swp=tnodes[curId].id;
               tnodes[curId].id=tnodes[destId];
               tnodes[destId].id=swp;
               fcad.updateCSG();
            }
        }
    }

    window.addEventListener("keydown", e=>{

        if (e.code === 'KeyW') {
            let mats={}
            scene.traverse((e)=>(e.isMesh)&&(mats[e.material.uuid]=e.material))
            for(let f in mats){
                let m=mats[f]
                if (m.userData.saveWireframe === undefined) {
                    m.userData.saveWireframe = m.wireframe
                    m.wireframe = true;
                } else {
                    m.wireframe = m.userData.saveWireframe
                    delete m.userData.saveWireframe;
                }
            }
        }
    }
    , false);
}

export default init;