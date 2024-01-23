const handleRes = (res) => {
  const resHTML = (data = null) => {
    res.status(200).send(data);
  };
  const resInvalid = (msg) => {
    res.status(400).json({ msg, code: 400 });
  };
  return { resHTML, resInvalid };
};

export default handleRes;
