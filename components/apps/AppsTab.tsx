import React from 'react';

const AppsTab: React.FC = () => {
  return (
    <div className="apps-tab-container">
      <iframe
        src="https://botsrhere.online/kithai/index.html"
        title="Kithai Apps"
        className="apps-iframe"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};

export default AppsTab;