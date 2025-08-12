---
tags:
  - AI
create_time: 2025-02-12 18:11
update_time: 2025/02/13 11:08
---

<table border="1">
  <thead>
    <tr>
      <th>版本</th>
      <th>名称</th>
      <th>参数（亿个）</th>
      <th>数值类型</th>
      <th>模型大小（G）</th>
      <th>模型格式</th>
      <th>发布者</th>
      <th>单机部署要求</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #e92e14; color: white;">
      <td>满血版</td>
      <td>DeepSeek-R1</td>
      <td>6710</td>
      <td>BF8</td>
      <td>700</td>
      <td>safetensors</td>
      <td>DeepSeek</td>
      <td>8 * Nvidia H200 (141G), 8 * AMD Mi300X (192G)</td>
    </tr>
    <tr style="background-color: #e3a47a; color: black;">
      <td>满血量化版</td>
      <td>deepseek-r1:671b</td>
      <td>6710</td>
      <td>INT4</td>
      <td>404</td>
      <td>GGUF</td>
      <td>Ollama</td>
      <td>8 * Nvidia H100 (80G), 8 * 昇腾 910B (64G)</td>
    </tr>
    <tr style="background-color: #529e31; color: white;">
      <td rowspan="6" style="text-align: center; vertical-align: middle;">蒸馏版</td>
      <td>DeepSeek-R1-Distill-Llama-70B</td>
      <td>700</td>
      <td rowspan="6" style="text-align: center; vertical-align: middle;">BF16</td>
      <td>150</td>
      <td rowspan="6" style="text-align: center; vertical-align: middle;">safetensors</td>
      <td rowspan="6" style="text-align: center; vertical-align: middle;">DeepSeek</td>
      <td>8 * 3090 (24G), 8 * 2080Ti (魔改22G)</td>
    </tr>
    <tr style="background-color: #529e31; color: white;">
      <td>DeepSeek-R1-Distill-Qwen-32B</td>
      <td>320</td>
      <td>66</td>
      <td>8 * 2080Ti (11G)</td>
    </tr>
    <tr style="background-color: #529e31; color: white;">
      <td>DeepSeek-R1-Distill-Qwen-14B</td>
      <td>140</td>
      <td>30</td>
      <td>2 * 2080Ti (魔改22G)</td>
    </tr>
    <tr style="background-color: #529e31; color: white;">
      <td>DeepSeek-R1-Distill-Qwen-8B</td>
      <td>80</td>
      <td>16</td>
      <td>PC</td>
    </tr>
    <tr style="background-color: #529e31; color: white;">
      <td>DeepSeek-R1-Distill-Qwen-7B</td>
      <td>70</td>
      <td>15</td>
      <td>PC</td>
    </tr>
    <tr style="background-color: #529e31; color: white;">
      <td>DeepSeek-R1-Distill-Qwen-1.5B</td>
      <td>15</td>
      <td>3.5</td>
      <td>移动端、边缘计算、PC</td>
    </tr>
    <tr style="background-color: #ecc7eb; color: black;">
      <td rowspan="6" style="text-align: center; vertical-align: middle;">蒸馏量化版</td>
      <td>deepseek-r1:70b</td>
      <td>700</td>
      <td rowspan="6" style="text-align: center; vertical-align: middle;">INT4</td>
      <td>43</td>
      <td rowspan="6" style="text-align: center; vertical-align: middle;">GGUF</td>
      <td rowspan="6" style="text-align: center; vertical-align: middle;">Ollama</td>
      <td>2 * 3090 (24G)</td>
    </tr>
    <tr style="background-color: #ecc7eb; color: black;">
      <td>deepseek-r1:32b</td>
      <td>320</td>
      <td>20</td>
      <td>PC</td>
    </tr>
    <tr style="background-color: #ecc7eb; color: black;">
      <td>deepseek-r1:14b</td>
      <td>140</td>
      <td>9</td>
      <td>PC</td>
    </tr>
    <tr style="background-color: #ecc7eb; color: black;">
      <td>deepseek-r1:8b</td>
      <td>80</td>
      <td>4.9</td>
      <td>移动端、PC</td>
    </tr>
    <tr style="background-color: #ecc7eb; color: black;">
      <td>deepseek-r1:7b</td>
      <td>70</td>
      <td>4.7</td>
      <td>移动端、PC</td>
    </tr>
    <tr style="background-color: #ecc7eb; color: black;">
      <td>deepseek-r1:1.5b</td>
      <td>15</td>
      <td>1.1</td>
      <td>移动端、边缘计算</td>
    </tr>
  </tbody>
</table>

## 为什么要本地部署？

1. **免费**：无需付费，只需有好设备。
2. **数据隐私**：数据本地存储，不上传云端，避免泄露。
3. **无限制**：内容输入更自由，无审查。
4. **无需网络**：离线可用，不受网络限制。
5. **性能高效**：利用本地硬件，提高速度和效率，避免延迟。
6. **灵活定制**：可使用私有数据微调模型，贴合特定领域需求。
