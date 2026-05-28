'use client'

import { useEffect } from 'react'

type Props = {
  containerId: string
}

export function HomeSnapScroll({ containerId }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 768) return

    const container = document.getElementById(containerId)
    if (!container) return

    let isAnimating = false
    let lastScrollAt = 0
    let wheelLockUntil = 0
    let pendingTargetTop: number | null = null

    const getSections = () =>
      Array.from(container.querySelectorAll<HTMLElement>('[data-snap-section="true"]'))

    const getCurrentIndex = (sections: HTMLElement[]) => {
      const currentTop = container.scrollTop
      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      sections.forEach((section, index) => {
        const distance = Math.abs(section.offsetTop - currentTop)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      return closestIndex
    }

    const onWheel = (event: WheelEvent) => {
      const now = Date.now()
      const isVerticalIntent = Math.abs(event.deltaY) > Math.abs(event.deltaX)
      const hasMeaningfulDelta = Math.abs(event.deltaY) > 8
      // #region agent log
      fetch('http://127.0.0.1:7839/ingest/457fabeb-3e19-4b42-b3ff-9a8b6b41fcef',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cca74c'},body:JSON.stringify({sessionId:'cca74c',runId:'initial',hypothesisId:'H2',location:'HomeSnapScroll.tsx:onWheel:entry',message:'Wheel event received',data:{deltaY:event.deltaY,deltaX:event.deltaX,isVerticalIntent,hasMeaningfulDelta,isAnimating,wheelLockUntil,lastScrollAt,now,scrollTop:container.scrollTop},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      if (isAnimating || now < wheelLockUntil) {
        // #region agent log
        fetch('http://127.0.0.1:7839/ingest/457fabeb-3e19-4b42-b3ff-9a8b6b41fcef',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cca74c'},body:JSON.stringify({sessionId:'cca74c',runId:'initial',hypothesisId:'H3',location:'HomeSnapScroll.tsx:onWheel:blocked',message:'Wheel prevented by lock/cooldown',data:{isAnimating,wheelLockUntil,lastScrollAt,now,deltaY:event.deltaY,scrollTop:container.scrollTop},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        event.preventDefault()
        return
      }
      if (!isVerticalIntent || !hasMeaningfulDelta) return
      if (now - lastScrollAt < 900) {
        event.preventDefault()
        return
      }

      const direction = Math.sign(event.deltaY)
      if (direction === 0) return

      const sections = getSections()
      if (sections.length < 2) return

      const currentIndex = getCurrentIndex(sections)
      const nextIndex = Math.min(
        sections.length - 1,
        Math.max(0, currentIndex + (direction > 0 ? 1 : -1))
      )
      // #region agent log
      fetch('http://127.0.0.1:7839/ingest/457fabeb-3e19-4b42-b3ff-9a8b6b41fcef',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cca74c'},body:JSON.stringify({sessionId:'cca74c',runId:'initial',hypothesisId:'H1',location:'HomeSnapScroll.tsx:onWheel:target',message:'Calculated current and next section',data:{direction,currentIndex,nextIndex,sectionsCount:sections.length,currentOffsetTop:sections[currentIndex]?.offsetTop,nextOffsetTop:sections[nextIndex]?.offsetTop,scrollTop:container.scrollTop},timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      if (nextIndex === currentIndex) return

      event.preventDefault()
      isAnimating = true
      lastScrollAt = now
      wheelLockUntil = now + 900
      pendingTargetTop = sections[nextIndex]?.offsetTop ?? null

      container.scrollTo({ top: sections[nextIndex]?.offsetTop ?? 0, behavior: 'smooth' })
      // #region agent log
      fetch('http://127.0.0.1:7839/ingest/457fabeb-3e19-4b42-b3ff-9a8b6b41fcef',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cca74c'},body:JSON.stringify({sessionId:'cca74c',runId:'initial',hypothesisId:'H4',location:'HomeSnapScroll.tsx:onWheel:scrollIntoView',message:'Triggered smooth scroll into next section',data:{nextIndex,nextOffsetTop:sections[nextIndex]?.offsetTop,scrollTopBefore:container.scrollTop},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    }

    const onScroll = () => {
      if (pendingTargetTop === null || !isAnimating) return
      const reachedTarget = Math.abs(container.scrollTop - pendingTargetTop) <= 2
      if (!reachedTarget) return
      isAnimating = false
      pendingTargetTop = null
      // #region agent log
      fetch('http://127.0.0.1:7839/ingest/457fabeb-3e19-4b42-b3ff-9a8b6b41fcef',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cca74c'},body:JSON.stringify({sessionId:'cca74c',runId:'initial',hypothesisId:'H5',location:'HomeSnapScroll.tsx:onScroll:unlock',message:'Animation lock released on target reached',data:{scrollTop:container.scrollTop,wheelLockUntil,lastScrollAt},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('scroll', onScroll)
    }
  }, [containerId])

  return null
}
