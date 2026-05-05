import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Radio, Button } from "antd";
import { cloneDeep, isNil } from "lodash";
import { Icon } from "@iconify/react";
import { CUSTOMER_TYPE, CUSTOMER_TYPE_KEY } from "~/modules/constant";
import { defEmptyCustomerName, defEmptyCustomerType } from "~/modules/formRule";

export default function UpsertCustomerModal({
  customer = null,
  onSubmit,
  onClose,
}) {
  const [form] = Form.useForm();
  const [touchedFields, setTouchedFields] = useState({});
  const isEdit = !isNil(customer);

  const initialFormState = {
    id: null,
    name: "",
    type: CUSTOMER_TYPE_KEY.CUSTOMER,
    phone: [],
    email: "",
    address: "",
  };

  useEffect(() => {
    if (isEdit) {
      const cloned = cloneDeep(customer);
      form.setFieldsValue(cloned);
    } else {
      form.setFieldsValue(initialFormState);
    }
  }, [customer]);

  const handleFinish = (values) => {
    const phone =
      values.phone && values.phone.length !== 0 ? values.phone.join(",") : "";
    const payload = { ...values, phone }
    if (customer?.id) {
      payload.id = customer.id
    }
    onSubmit(payload)
  }

  return (
    <Modal
      open
      centered
      width="50vw"
      title={`${isEdit ? "Sửa" : "Thêm"} thông tin khách hàng`}
      okText="Lưu"
      cancelText="Đóng"
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        onFinish={handleFinish}
        validateTrigger="onBlur"
      >
        <Form.Item
          label="Tên khách hàng"
          name="name"
          rules={[{ required: true, validator: defEmptyCustomerName }]}
          hasFeedback={touchedFields.name}
          onBlur={() => setTouchedFields({ ...touchedFields, name: true })}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phân loại"
          name="type"
          rules={[{ required: true, validator: defEmptyCustomerType }]}
          hasFeedback={touchedFields.type}
          onBlur={() => setTouchedFields({ ...touchedFields, type: true })}
        >
          <Radio.Group options={Object.values(CUSTOMER_TYPE)} />
        </Form.Item>

        <Form.List name="phone">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  label={`Số điện thoại ${index + 1}`}
                  wrapperCol={{ span: 8 }}
                  className="mb-2"
                >
                  <div className="flex items-center">
                    <Form.Item {...field} noStyle>
                      <Input />
                    </Form.Item>
                    <Icon
                      icon="uil:times"
                      className="text-red-500 cursor-pointer"
                      width="24px"
                      onClick={() => remove(field.name)}
                    />
                  </div>
                </Form.Item>
              ))}
              <Form.Item wrapperCol={{ span: 8, offset: 4 }}>
                <Button
                  type="dashed"
                  block
                  className="flex items-center justify-center"
                  onClick={() => add("")}
                >
                  <Icon icon="ic:round-plus" width="24px" />
                  Thêm số điện thoại
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: "email", message: "Email không hợp lệ" }]}
          hasFeedback={touchedFields.email}
          onBlur={() => setTouchedFields({ ...touchedFields, email: true })}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          hasFeedback={touchedFields.address}
          onBlur={() => setTouchedFields({ ...touchedFields, address: true })}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
