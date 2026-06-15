import re

with open('/app/NightOwl/web-prototype/src/index.css', 'r') as f:
    css = f.read()

# Default theme modifications
css = re.sub(
    r'.theme-default::before.*?star-twinkle.*?}',
    r'''.theme-default::before {
  /* Distant Cityscape Silhouette */
  content: '';
  position: fixed;
  bottom: 0; left: 0; width: 100%; height: 25vh;
  background:
    linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%),
    repeating-linear-gradient(to right, transparent 0, transparent 20px, rgba(255, 255, 100, 0.1) 20px, rgba(255, 255, 100, 0.1) 25px, transparent 25px, transparent 40px),
    linear-gradient(to right, #0a0b1c 10%, #11142e 20%, #0a0b1c 30%, #151835 40%, #0a0b1c 50%, #1a1e45 70%, #0a0b1c 80%, #0f1228 90%);
  background-size: 100% 100%, 150px 100%, 100% 100%;
  mask-image: linear-gradient(to top, black 50%, transparent 100%);
  -webkit-mask-image: linear-gradient(to top, black 20%, transparent 100%);
  z-index: -1;
}''',
    css, flags=re.DOTALL
)

css = re.sub(
    r'.theme-default::after.*?star-twinkle.*?}',
    r'''.theme-default::after {
  /* Stars Layer */
  content: '';
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image:
    radial-gradient(1px 1px at 20px 30px, #ffffff, transparent),
    radial-gradient(2px 2px at 150px 80px, #ffffff, transparent),
    radial-gradient(1.5px 1.5px at 250px 200px, #ffffff, transparent),
    radial-gradient(2.5px 2.5px at 80px 280px, #ffffff, transparent);
  background-size: 300px 300px;
  animation: star-twinkle 6s ease-in-out infinite;
  z-index: -2;
}''',
    css, flags=re.DOTALL
)


# Aurora Bubbles
if '.theme-aurora .bubble' not in css:
    css = css.replace(
        '.theme-aurora::after {',
        '''.theme-aurora .bubble {
  /* Aurora Melon Soda Bubbles */
  position: fixed;
  bottom: -20px;
  background: radial-gradient(circle at 30% 30%, rgba(82, 255, 168, 0.6), rgba(255, 255, 255, 0.2) 60%, transparent 100%);
  border: 1px solid rgba(82, 255, 168, 0.3);
  border-radius: 50%;
  z-index: -1;
  animation: bubble-rise infinite ease-in;
  box-shadow: inset 4px 4px 10px rgba(82, 255, 168, 0.4), 0 0 15px rgba(82, 255, 168, 0.2);
}

.theme-aurora::after {'''
    )

# Deep Sea fish
if 'fish-swim' not in css:
    css = css.replace(
        '.theme-deepsea::before {',
        '''@keyframes fish-swim {
  0% { transform: translateX(110vw) translateY(0) scaleX(-1); opacity: 0; }
  10% { opacity: 0.4; }
  50% { transform: translateX(50vw) translateY(-20px) scaleX(-1); opacity: 0.5; }
  90% { opacity: 0.4; }
  100% { transform: translateX(-10vw) translateY(10px) scaleX(-1); opacity: 0; }
}

.theme-deepsea::before {'''
    )

    css = css.replace(
        '.bubble {',
        '''.theme-deepsea::after {
  content: '🐟';
  font-size: 24px;
  position: fixed;
  top: 60%; left: 0;
  z-index: -1;
  animation: fish-swim 25s linear infinite;
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
}
.bubble {'''
    )

# Dusk vibraton
css = css.replace('#d1794b 100%);', '#ff8c42 100%);')

if 'mirage-vibrate' not in css:
    css = css.replace(
        '.theme-dusk {',
        '''@keyframes mirage-vibrate {
  0% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(2px) scaleY(1.02); filter: blur(1px); }
  100% { transform: translateY(0) scaleY(1); }
}

.theme-dusk {'''
    )

    css = css.replace(
        '/* テーマ：銀河（Galaxy） - 天の川の帯を描画 */',
        '''.theme-dusk::after {
  /* Vibrating Horizon Mirage */
  content: '';
  position: fixed;
  bottom: 0; left: 0; width: 100%; height: 30vh;
  background: linear-gradient(180deg, transparent 0%, rgba(255, 140, 66, 0.4) 20%, rgba(209, 121, 75, 0.8) 100%);
  z-index: -1;
  animation: mirage-vibrate 3s ease-in-out infinite;
  pointer-events: none;
  mix-blend-mode: overlay;
}

/* テーマ：銀河（Galaxy） - 天の川の帯を描画 */'''
    )

# Galaxy changes
css = css.replace('linear-gradient(135deg, #0b071a 0%, #1a0b2e 50%, #0b071a 100%);', 'linear-gradient(0deg, #1a0b2e 0%, #0b071a 100%);')

css = css.replace(
    'radial-gradient(1px 1px at 240px 50px, #ffffff, transparent),',
    '''radial-gradient(1px 1px at 240px 50px, #ffffff, transparent),
    radial-gradient(2px 2px at 150px 200px, #ffffff, transparent),
    radial-gradient(1px 1px at 180px 250px, #ffd1dc, transparent),
    radial-gradient(1.5px 1.5px at 320px 100px, #ffffff, transparent),
    radial-gradient(1px 1px at 280px 180px, #c4e0e5, transparent),'''
)

css = css.replace('background-size: 150px 150px;', 'background-size: 100px 100px;')

if 'animation: star-twinkle 5s' not in css:
    css = css.replace('z-index: -2;', 'z-index: -2;\n  animation: star-twinkle 5s ease-in-out infinite;')

if '.theme-galaxy .bubble' not in css:
    css = css.replace(
        '::selection {',
        '''.theme-galaxy .bubble {
  /* Galaxy Fizzy Bubbles */
  position: fixed;
  bottom: -20px;
  background: radial-gradient(circle at 30% 30%, rgba(189, 82, 255, 0.6), rgba(255, 255, 255, 0.2) 60%, transparent 100%);
  border: 1px solid rgba(189, 82, 255, 0.3);
  border-radius: 50%;
  z-index: -1;
  animation: bubble-rise infinite ease-in;
  box-shadow: inset 4px 4px 10px rgba(189, 82, 255, 0.4), 0 0 15px rgba(189, 82, 255, 0.2);
}

::selection {'''
    )

with open('/app/NightOwl/web-prototype/src/index.css', 'w') as f:
    f.write(css)
