By the end of this quickstart, you will have an Executive Assistant that labels the Gmail messages needing your attention and pauses for approval before acting, all set up without code or a model API key and controlled through chat.

> 
You interact with your agent through chat, just like texting a helpful assistant.

You will start from the prebuilt **Executive Assistant** [template](lc:langsmith/fleet/templates), which manages your inbox, calendar, and daily brief.

## Before you start

You need:
- A LangSmith account ([sign up here](https://smith.langchain.com/agents?skipOnboarding=true)).
- A Gmail account.
- A Google Calendar.

Fleet manages the AI model for you, so you do not need your own model provider API key. For more information, see [Models](lc:langsmith/fleet/essentials#models).

## 1. Create your agent

  #### Step: Navigate to Fleet

    1. In the [LangSmith UI](https://smith.langchain.com), click  **Switch to Fleet** at the top of the left-hand navigation.
  

  #### Step: Choose a template

    1. Select **Templates** in the left-hand navigation, or click **+** in **My Agents** and select **From template**.
    1. Select the **Executive Assistant** template to create your agent.
    1. Click **Create Agent** at the top right.

    

> [!TIP]
>
> If you do not want to start with a template, choose **Build with AI** or **New agent** when you create an agent and describe the agent you want. The agent configures itself and pauses at key points for your input.


  

  #### Step: Skip channel setup for now

    When the agent prompts you to connect a channel, click **Skip for now**. You connect channels in a [later step](#3-configure-your-agent).
  

  #### Step: Answer onboarding questions

    Provide information so your agent knows how to work the way you prefer.
  

## 2. Connect tools

Your agent asks you to connect to your Gmail and Google Calendar accounts.

A connection gives your agent the [tools](lc:langsmith/fleet/tools) to use a service. A [channel](lc:langsmith/fleet/channels) lets the service trigger the agent. You connect Gmail and Google Calendar here, then add Gmail as a channel in [Configure your agent](#3-configure-your-agent).

  #### Step: Connect Gmail

    1. In the **Gmail** row, click **Connect** on the right.
    2. In the dialog, click **+ Connect new account**.
    3. Choose your account and click **Continue**.
    4. Review permissions and click **Allow**.
    5. LangSmith redirects you back to Fleet. Select **Gmail** to expand the row.
    6. Click **Choose account** and select the account you chose in step 3.
  

  #### Step: Connect Google Calendar

    1. Connecting Gmail authorized your Google account for Gmail only, not Google Calendar. To grant calendar access, click **Update permissions** on the right in the **Google Calendar** row.
    2. In the dialog, click **Reauthorize**.
    3. Choose your account and click **Continue**.
    4. Review permissions and click **Allow**.
    5. LangSmith redirects you back to Fleet. Close the dialog.
    6. Click **Save and continue**.
  


> [!NOTE]
>
> Your agent only accesses your accounts when working on tasks you give it. You can revoke access anytime in the [agent sidebar](lc:langsmith/fleet/essentials#agent-sidebar) or your Google account settings.


## 3. Configure your agent

There are two ways to configure your agent:

- Chatting with your agent directly
- Modifying settings in the [agent sidebar](lc:langsmith/fleet/essentials#agent-sidebar)

This section describes how to configure your agent using the agent sidebar.

  #### Step: Open the agent sidebar

    Click ** Configure** at the top right to open the agent sidebar.
  

  #### Step: View connections

    Expand the **Connections** drawer. **Gmail** and **Google Calendar** appear as **Connected**. If either shows as not connected, complete [2. Connect tools](#2-connect-tools) before continuing.
  

  #### Step: Configure a tool to ask for approval

    In the **Connections** drawer, click **Gmail** to view the available tools. By default, the tools are enabled and set to **Auto**, so they run without your approval.

    For **Apply Label**, click **Ask**, so your agent pauses and waits for your approval before continuing. You can accept the proposed action, or reject it and tell the agent what to change. For more information, see [Human-in-the-loop](lc:langsmith/fleet/essentials#human-in-the-loop).
  

  #### Step: Connect channels

    Expand the **Channels** drawer. Click **Gmail**. Select the account that you set up for **Connections**. Click **Confirm**.
  

  #### Step: Save your changes

    Click **Save** at the top of the sidebar to save your changes, then click **X** to close the panel.
  

## 4. Test your agent

  #### Step: Send your agent a task

    In the agent chat, try out the Executive Assistant, for example:

    > _Apply a "Review" label to emails that I receive, which require some kind of review from me._
  

  #### Step: Accept or reject the agent

    Click **Accept** to approve the agent's proposed action or tell the agent what it did wrong and click **Reject**.
  

  #### Step: Check your inbox in Gmail

    If you clicked **Accept**, emails that need review now have the **Review** label in your inbox.
  

## Edit your agent

You may want to update your agent's instructions or include more tools. You can chat with your agent directly to ask for updates, or configure it from the [agent sidebar](lc:langsmith/fleet/essentials#agent-sidebar):

- Edit the agent's instructions (its `AGENTS.md`) in the **Knowledge** drawer. See [Instructions](lc:langsmith/fleet/essentials#instructions).
- Add integrations and tools in the **Connections** drawer, and set each tool to run automatically or [ask for approval](lc:langsmith/fleet/essentials#human-in-the-loop). See [Tools](lc:langsmith/fleet/tools).
- Connect [Slack](lc:langsmith/fleet/slack-app), [Gmail](lc:langsmith/fleet/channels#add-a-gmail-channel), or [Microsoft Teams](lc:langsmith/fleet/teams-app) in the **Channels** drawer.
- Run your agent on a [schedule](lc:langsmith/fleet/schedules) in the **Schedules** drawer.
- Change the [model](lc:langsmith/fleet/manage-agent-settings#change-the-model) in the **Advanced settings** drawer.

## Next steps

Now that you have created your first agent, here is what to explore:

  ### [Try more templates](#)
Explore prebuilt agents for common tasks

  ### [Add automation](#)
Run your agent automatically with channels (Slack, email, schedules)

  ### [Connect more tools](#)
Add Slack, GitHub, Linear, and more

  ### [Build complex agents](#)
Use sub-agents to break down big tasks
