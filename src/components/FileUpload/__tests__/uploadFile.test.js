import { uploadFile } from '../uploadFile';

describe('uploadFile', () => {
  it('maps directory to path', async () => {
    const onUpload = jest.fn(async payload => ({ data: { code: 0, data: payload } }));
    await uploadFile({ file: { name: 'a.txt' }, directory: 'docs/', onUpload });
    expect(onUpload).toHaveBeenCalledWith({ file: { name: 'a.txt' }, path: 'docs/' });
  });

  it('accepts path alias so uploads do not fall back to root', async () => {
    const onUpload = jest.fn(async payload => ({ data: { code: 0, data: payload } }));
    await uploadFile({ file: { name: 'a.txt' }, path: 'documents/', onUpload });
    expect(onUpload).toHaveBeenCalledWith({ file: { name: 'a.txt' }, path: 'documents/' });
  });

  it('prefers directory over path when both are provided', async () => {
    const onUpload = jest.fn(async payload => ({ data: { code: 0, data: payload } }));
    await uploadFile({ file: { name: 'a.txt' }, directory: 'a/', path: 'b/', onUpload });
    expect(onUpload).toHaveBeenCalledWith({ file: { name: 'a.txt' }, path: 'a/' });
  });

  it('omits path for root/empty directory', async () => {
    const onUpload = jest.fn(async payload => ({ data: { code: 0, data: payload } }));
    await uploadFile({ file: { name: 'a.txt' }, directory: '', onUpload });
    expect(onUpload).toHaveBeenCalledWith({ file: { name: 'a.txt' } });
  });
});
