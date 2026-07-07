/* ============================================
 * 免费咨询页 Consult
 * ============================================ */
(function () {
    'use strict';

    const { defineComponent, ref, reactive, onMounted } = Vue;

    const ConsultPage = defineComponent({
        name: 'ConsultPage',
        setup() {
            const form = reactive({
                name: '',
                phone: '',
                wechat: '',
                course: '',
                message: '',
            });
            const submitting = ref(false);
            const courseOptions = ref([]);

            const formRef = ref(null);
            const rules = {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 20, message: '姓名长度 2-20', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {
                        pattern: /^1[3-9]\d{9}$/,
                        message: '请输入正确的 11 位手机号',
                        trigger: 'blur',
                    },
                ],
                wechat: [
                    { max: 50, message: '微信号不超过 50 字符', trigger: 'blur' },
                ],
                course: [
                    { required: true, message: '请选择咨询课程', trigger: 'change' },
                ],
            };

            async function loadCourses() {
                try {
                    const data = await window.API.getCourses();
                    courseOptions.value = (data || []).map((c) => ({
                        label: c.title,
                        value: c.title,
                    }));
                } catch (e) {
                    console.error('加载课程列表失败', e);
                }
            }

            async function submit() {
                try {
                    await formRef.value.validate();
                } catch {
                    return;
                }
                submitting.value = true;
                try {
                    await window.API.submitConsultation({
                        name: form.name,
                        phone: form.phone,
                        wechat: form.wechat || null,
                        course: form.course,
                        message: form.message || null,
                    });
                    ElementPlus.ElMessage.success('提交成功，顾问会尽快联系您！');
                    Object.assign(form, {
                        name: '',
                        phone: '',
                        wechat: '',
                        course: '',
                        message: '',
                    });
                    formRef.value?.resetFields?.();
                } catch (e) {
                    ElementPlus.ElMessage.error(e.message || '提交失败，请稍后再试');
                } finally {
                    submitting.value = false;
                }
            }

            const openChat = () => window.Router.openAiChat();

            onMounted(loadCourses);

            return {
                form,
                formRef,
                rules,
                submitting,
                courseOptions,
                submit,
                openChat,
            };
        },
        template: `
            <div class="section section--alt">
                <div class="container">
                    <div class="apple-headline">
                        <p class="apple-eyebrow">免费咨询</p>
                        <h2>与我们取得联系。</h2>
                        <p>填写表单，课程顾问将在 24 小时内与您联系。</p>
                    </div>

                    <div class="consult-grid">
                        <div class="form-card">
                            <h3 style="margin-bottom:24px; font-size:21px; font-weight:600;">留下您的信息</h3>
                            <el-form
                                ref="formRef"
                                :model="form"
                                :rules="rules"
                                label-position="top"
                            >
                                <el-form-item label="姓名" prop="name">
                                    <el-input
                                        v-model="form.name"
                                        placeholder="请输入您的姓名"
                                        maxlength="20"
                                        show-word-limit
                                    />
                                </el-form-item>
                                <el-form-item label="手机号" prop="phone">
                                    <el-input
                                        v-model="form.phone"
                                        placeholder="请输入 11 位手机号"
                                        maxlength="11"
                                    />
                                </el-form-item>
                                <el-form-item label="微信号" prop="wechat">
                                    <el-input
                                        v-model="form.wechat"
                                        placeholder="选填，方便添加您"
                                    />
                                </el-form-item>
                                <el-form-item label="咨询课程" prop="course">
                                    <el-select
                                        v-model="form.course"
                                        placeholder="请选择要咨询的课程"
                                        style="width:100%;"
                                    >
                                        <el-option
                                            v-for="opt in courseOptions"
                                            :key="opt.value"
                                            :label="opt.label"
                                            :value="opt.value"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="留言内容">
                                    <el-input
                                        v-model="form.message"
                                        type="textarea"
                                        :rows="4"
                                        placeholder="请简要描述您的需求或问题"
                                    />
                                </el-form-item>
                                <el-form-item>
                                    <el-button
                                        type="primary"
                                        size="large"
                                        :loading="submitting"
                                        @click="submit"
                                        style="width:100%;"
                                    >提交咨询</el-button>
                                </el-form-item>
                                <p style="color:#a0aec0; font-size:12px; text-align:center;">
                                    提交即表示您同意我们收集并使用以上信息为您服务
                                </p>
                            </el-form>
                        </div>

                        <!-- 右侧 AI 入口 -->
                        <div>
                            <div class="aside-card">
                                <h3>AI 智能顾问</h3>
                                <p style="color:#86868b; font-size:14px; margin-bottom:16px; line-height:1.5;">
                                    想快速了解课程？与 AI 助手对话，获取课程介绍、价格与学习路线建议。
                                </p>
                                <el-button
                                    type="primary"
                                    size="large"
                                    style="width:100%; margin-bottom:16px;"
                                    @click="openChat"
                                >开始对话</el-button>

                                <el-divider>咨询流程</el-divider>
                                <ul style="list-style:none; padding:0; color:#4a5568; font-size:14px;">
                                    <li style="padding:8px 0; display:flex; gap:8px;">
                                        <span style="color:#3182ce; font-weight:bold;">①</span>
                                        提交您的咨询信息
                                    </li>
                                    <li style="padding:8px 0; display:flex; gap:8px;">
                                        <span style="color:#3182ce; font-weight:bold;">②</span>
                                        顾问 24 小时内主动联系
                                    </li>
                                    <li style="padding:8px 0; display:flex; gap:8px;">
                                        <span style="color:#3182ce; font-weight:bold;">③</span>
                                        1v1 学习规划与课程推荐
                                    </li>
                                    <li style="padding:8px 0; display:flex; gap:8px;">
                                        <span style="color:#3182ce; font-weight:bold;">④</span>
                                        报名后开通学习账号
                                    </li>
                                </ul>

                                <el-divider>服务承诺</el-divider>
                                <p style="color:#4a5568; font-size:13px; line-height:1.8;">
                                    ✓ 信息严格保密<br>
                                    ✓ 顾问专业耐心<br>
                                    ✓ 不强制推销<br>
                                    ✓ 7 天无理由退课
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
    });

    window.ConsultPage = ConsultPage;
})();
