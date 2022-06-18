export const Request = (props) => {
  const {value, onChange, onRun, ...rest} = props;
  return (
    <Card
      title="消息体"
      bodyStyle={{paddingLeft: 0}}
      extra={
        <div onClick={() => onRun(value)}>
          <Icon
            type="play-circle"
            style={{color: '#3888FF', marginRight: 9, cursor: 'pointer'}}
          />
          <span style={{color: '#3888FF', marginRight: 9, cursor: 'pointer'}}>
            立即运行
          </span>
        </div>
      }
    >
      <Editor value={value} onChange={onChange} {...rest} />
    </Card>
  );
};
