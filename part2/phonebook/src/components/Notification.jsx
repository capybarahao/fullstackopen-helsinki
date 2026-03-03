const Notification = ({ errMsg, scsMsg }) => {
  if (errMsg === null && scsMsg === null) {
    return null;
  }

  return (
    <>
      <div>{errMsg && <div>{errMsg}</div>}</div>
      <div>{scsMsg && <div>{scsMsg}</div>}</div>
    </>
  );
};

export default Notification;
