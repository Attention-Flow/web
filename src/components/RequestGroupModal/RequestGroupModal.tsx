import { globalMessage } from '@/layouts';
import { useModel } from '@@/exports';
import { LinkOutlined, TagOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Input, Modal, ModalProps, message } from 'antd';
import { useState } from 'react';

export default function RequestGroupModal({
  groupNamePlaceholder,
  linkPlaceholder,
  onSubmit,
  ...modalProps
}: ModalProps & {
  groupNamePlaceholder: string;
  linkPlaceholder?: string;
  onSubmit: (e: any) => void;
}) {
  const { runRequestGroup } = useModel('application', (state) => ({
    runRequestGroup: state.runRequestGroup,
  }));
  const [_message, messageContextHolder] = message.useMessage();

  const [groupName, setGroupName] = useState('');
  const [link, setLink] = useState('');

  const { runAsync: runRequest, loading: requestLoading } = useRequest(
    async (e: any) => {
      if (!groupName || (!!linkPlaceholder && !link)) {
        globalMessage.info('Please fill in the form!');
        return;
      }
      try {
        await runRequestGroup(groupName, link || groupName);
        _message.success('Please wait for checking.');
        onSubmit(e);
      } catch (e) {
        console.log(e);
        _message.error('Network error!');
      }
    },
    {
      manual: true,
    },
  );

  return (
    <Modal
      destroyOnClose={true}
      centered={true}
      footer={
        <Button loading={requestLoading} onClick={runRequest} type={'primary'}>
          Request
        </Button>
      }
      maskClosable={true}
      width={420}
      {...modalProps}
    >
      <Input
        value={groupName}
        disabled={requestLoading}
        onChange={(e) => setGroupName(e.target.value)}
        size={'large'}
        style={{ boxShadow: 'none', border: 'none', padding: 12 }}
        placeholder={groupNamePlaceholder}
        prefix={<TagOutlined />}
      />
      {!!linkPlaceholder && (
        <Input
          value={link}
          disabled={requestLoading}
          onChange={(e) => setLink(e.target.value)}
          size={'large'}
          style={{
            boxShadow: 'none',
            border: 'none',
            padding: 12,
            marginTop: 12,
          }}
          placeholder={linkPlaceholder}
          prefix={<LinkOutlined />}
        />
      )}
      {messageContextHolder}
    </Modal>
  );
}
