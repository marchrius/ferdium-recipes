const _path = _interopRequireDefault(require('path'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.addEventListener('beforeunload', async () => {
  try {
    const { session } = Ferdi.getCurrentWebContents();
    session.flushStorageData();
    session.clearStorageData({
      storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb'],
    });
    const registrations = await window.navigator.serviceWorker.getRegistrations();
    registrations.forEach(r => {
      r.unregister();
      console.log('ServiceWorker unregistered');
    });
  } catch (err) {
    console.err(err);
  }
});

module.exports = Ferdi => {
  const getMessages = function getMessages() {
    let count = 0;
    let indirectCount = 0;

    const parentChatElem = document.querySelector('[aria-label="Chat list"]');
    if (!parentChatElem) {
      return;
    }

    const unreadSpans = parentChatElem.querySelectorAll('span[aria-label]');
    for (let i = 0; i < unreadSpans.length; i++) {
      const unreadElem = unreadSpans[i];
      const countValue = Ferdi.safeParseInt(unreadElem.textContent);
      if (countValue > 0) {
        if (!unreadElem.parentNode.previousSibling || unreadElem.parentNode.previousSibling.querySelectorAll('[data-icon=muted]').length === 0) {
          count += countValue;
        } else {
          indirectCount += countValue;
        }
      }
    }

    Ferdi.setBadge(count, indirectCount);
  };

  Ferdi.loop(getMessages);

  Ferdi.injectCSS(_path.default.join(__dirname, 'service.css'));
};
