const hour = new Date().getHours();

if (hour >= 5 && hour < 12) {
  console.log('Godmorgen');
} else if (hour >= 12 && hour < 18) {
  console.log('God eftermiddag');
} else {
  console.log('Godaften');
}
