const handleRes = (res) => {
  const resSuc = (data = null) => {
    res.status(200).json({ msg: 'success', data, code: 200 });
  };
  const resInvalid = (msg) => {
    res.status(400).json({ msg, code: 400 });
  };
  return { resSuc, resInvalid };
};

export default handleRes;
