async (page) => {
  const context = await page.context().browser().newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: 'light',
    locale: 'zh-CN'
  });
  await context.addInitScript(() => {
    window.localStorage.setItem('panda-studio-locale', 'zh');
  });
  const mobile = await context.newPage();
  await mobile.goto('http://localhost:3000');
  await mobile.getByRole('heading', { name: '不同的噪音 同一间大房间', exact: true }).waitFor({ state: 'visible' });
  await mobile.evaluate(() => document.fonts.ready);
  await mobile.waitForTimeout(2500);
  const root = '/Users/qizhi_dong/Projects/panda landing page/site/output/playwright/mobile-preview/';
  await mobile.screenshot({ path: root + '01-home.png' });
  await mobile.evaluate(() => {
    const section = document.querySelector('#room');
    window.scrollTo({ top: section.getBoundingClientRect().top + scrollY + (section.offsetHeight - innerHeight) * 0.105, behavior: 'instant' });
  });
  await mobile.waitForTimeout(1800);
  await mobile.screenshot({ path: root + '02-intro.png' });
  await mobile.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '作品', exact: true }).click();
  await mobile.waitForTimeout(1600);
  await mobile.screenshot({ path: root + '03-records.png' });
  await mobile.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '招募', exact: true }).click();
  await mobile.waitForTimeout(1600);
  await mobile.screenshot({ path: root + '04-auditions.png' });
  await mobile.getByRole('button', { name: '打开小助手', exact: true }).click();
  await mobile.waitForTimeout(400);
  await mobile.screenshot({ path: root + '05-helper.png' });
  console.log(await mobile.evaluate(() => ({viewport: [innerWidth,innerHeight],pageWidth:document.documentElement.scrollWidth,touch:navigator.maxTouchPoints,coarsePointer:matchMedia('(pointer: coarse)').matches,focusedElement:document.activeElement.tagName})));
  await context.close();
}
