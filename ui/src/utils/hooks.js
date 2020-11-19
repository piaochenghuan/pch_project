import React, { useState, useEffect, useContext } from 'react'

// 获取视口宽高的hooks
export function useViewport() {
    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)

    useEffect(() => {
        function onResize() {
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)

            // let dpr, rem, scale, rootWidth;
            // let rootHtml = document.documentElement;

            // dpr = window.devicePixelRatio || 1; //移动端必须设置
            // //限制展现页面的最小宽度
            // rootWidth = rootHtml.clientWidth < 300 ? 300 : rootHtml.clientWidth;
            // rem = rootWidth * dpr / 375; // 19.2 = 设计图尺寸宽1920 / 100（设计图的rem = 100）
            // scale = 1 / dpr;

            // // 设置viewport，进行缩放，达到高清效果 (移动端添加)
            // let vp = window.document.querySelector('meta[name="viewport"]');
            // vp && vp.setAttribute('content', 'width=' + dpr * rootHtml.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');
            // // 动态写入样式
            // rootHtml.style.fontSize = `${rem}px`;
        }
        window.addEventListener('resize', onResize)

        return () => window.removeEventListener('resize', onResize)
    }, [])

    return { width, height }
}



// 获取/修改用户信息
export function useUserInfo() {
    const [userInfo, setUserInfo] = useState(localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')) || {})

    function setLocalStorage(key, value) {
        if (key && value) {
            localStorage.setItem(key, JSON.stringify(value))
            if (key === 'userInfo') {
                setUserInfo(value)
            }
        }
    }

    return [userInfo, setLocalStorage]
}