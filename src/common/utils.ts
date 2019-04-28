/**
 * 加载歌曲
 * 
 * @param url 歌曲 URL
 */
export function loadSound(url: string) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function loaded() {
      resolve(xhr.response);
    }
    xhr.send();
  });
}

